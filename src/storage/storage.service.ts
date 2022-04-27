import { Readable } from 'stream'
import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import LocalStorage from './storage.local'
import { InjectModel } from '@nestjs/mongoose'
import { Storage } from './schemas/storage.schema'
import md5 from '../utils/md5'

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly localStorage = new LocalStorage()
  private readonly logger = new Logger(StorageService.name)

  constructor(@InjectModel(Storage.name) private storageModel: any) {}

  onModuleInit() {
    this.logger.log('StorageService dependencies initialized')
  }

  async find(query = {}): Promise<Storage[]> {
    return this.storageModel.find(query).exec()
  }

  async findOne(query = {}): Promise<any> {
    return this.storageModel.findOne(query).lean()
  }

  async deleteOne(id: string, userId: string): Promise<Storage> {
    return this.storageModel.findOneAndRemove({ _id: id, userId })
  }

  async deleteAll(): Promise<any> {
    return this.storageModel.deleteMany()
  }

  async store(files, userId: string): Promise<Record<string, string>> {
    const fields = Object.keys(files || {})

    if (fields.length <= 0) {
      this.logger.error('No file data found from the request')
    }

    const fileIDs = {}

    for (const field of fields) {
      const file = files[field]
      const fileStream = file?.buffer?.toString()
      const hash = await md5(Readable.from(fileStream))

      file.hash = hash

      let doc = await this.findOne({
        MD5Hash: hash,
        userId
      })
      const fileDoc = await this.storageModel.findByHash(hash)

      if (!doc) {
        doc = await this.storageModel.createByFile({
          ...file,
          userId
        })
      }

      if (!fileDoc) {
        await this.localStorage.store(doc.MD5Hash, Readable.from(fileStream))
      } else {
        this.logger.log(`Stored file ${doc._id} is matched, no new file stored`)
      }

      fileIDs[field] = doc._id
    }

    return fileIDs
  }

  async getFiles(query = {}, pagination = {}): Promise<any> {
    const files = await this.storageModel.getFiles(query, pagination)

    return files
  }

  async getFile(id: string, userId: string): Promise<{
    stream: any
    doc?: any
  }> {
    const doc = await this.findOne({
      _id: id,
      userId
    })

    if (!doc) {
      return {
        stream: ''
      }
    }

    const stream = this.localStorage.fetch(doc.MD5Hash)

    if (!stream) {
      this.logger.error(`Found file with id ${doc._id} in database, but no file found on file system`)

      return {
        stream: ''
      }
    }

    return {
      stream,
      doc
    }
  }

  async removeFile(id: string, userId: string): Promise<any> {
    const doc = await this.findOne({
      _id: id,
      userId
    })

    this.logger.log(`Storage service: - [remove] - the file id => ${id}`)
    this.logger.log(`Storage service: - [remove] - the file info => ${JSON.stringify(doc)}`)

    if (!doc) {
      return ''
    }

    try {
      const hash = doc.MD5Hash
      const files = await this.find({ MD5Hash: doc.MD5Hash })

      await this.deleteOne(id, userId)

      // If the file is not used by other users, remove it
      if (files.length <= 1) {
        await this.localStorage.remove(hash)
      }
    } catch (error) {
      this.logger.error(`Remove file error: ${error}`)

      return error
    }

    return id
  }
}
