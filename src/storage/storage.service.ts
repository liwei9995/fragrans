import { Readable } from 'stream'
import { Injectable, Logger } from '@nestjs/common'
import LocalStorage from './storage.local'
import { InjectModel } from '@nestjs/mongoose'
import { Storage } from './schemas/storage.schema'
import md5 from '../utils/md5'

@Injectable()
export class StorageService {
  private readonly localStorage = new LocalStorage()
  private readonly logger = new Logger(StorageService.name)

  constructor(@InjectModel(Storage.name) private storageModel: any) {}

  async find(query = {}): Promise<Storage[]> {
    return this.storageModel.find(query).exec()
  }

  async findOne(query = {}): Promise<any> {
    return this.storageModel.findOne(query).lean()
  }

  async deleteOne(id: string): Promise<Storage> {
    return this.storageModel.findOneAndRemove({ _id: id })
  }

  async deleteAll() {
    return this.storageModel.deleteMany()
  }

  async store(files) {
    const fields = Object.keys(files || {})

    if (!fields || fields.length <= 0) {
      this.logger.error('no file data found in request')
    }

    const fileIDs = {}

    for (const field of fields) {
      const file = files[field]
      const fileStream = file?.buffer?.toString()
      const hash = await md5(Readable.from(fileStream))

      file.hash = hash

      let doc = await this.storageModel.findByHash(hash)

      if (!doc) {
        doc = await this.storageModel.createByFile(file)
        await this.localStorage.store(doc._id, Readable.from(fileStream))
      } else {
        this.logger.log(`stored file ${doc._id} matched, no new file stored.`)
      }

      fileIDs[field] = doc._id
    }

    return fileIDs
  }

  async getFiles(query = {}, pagination = {}) {
    const files = await this.storageModel.getFiles(query, pagination)

    return files
  }

  async getFile(_id, userId) {
    const doc = await this.findOne({
      _id,
      userId
    })

    if (!doc) {
      return {
        stream: ''
      }
    }

    const stream = this.localStorage.fetch(doc._id)

    if (!stream) {
      this.logger.error(`found file with id ${doc._id} in database, but no file found on file system.`)

      return {
        stream: ''
      }
    }

    return {
      stream,
      doc
    }
  }
}
