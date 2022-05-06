import {
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
  Response,
  StreamableFile,
  BadRequestException,
  Request,
  Body,
  Param,
  Logger,
  Delete
} from '@nestjs/common'
import * as contentDisposition from 'content-disposition'
import { AnyFilesInterceptor } from '@nestjs/platform-express'
import { Types } from 'mongoose'
import { Role } from '../common/enums/role.enum'
import { Roles } from '../common/decorator/roles.decorator'
import { StorageService } from './storage.service'
import { ReadStream } from 'fs'

@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}
  private readonly logger = new Logger(StorageController.name)

  @Post('upload')
  @Roles(Role.User)
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(
    @Request() req,
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    const userId = req.user?.userId

    if (!Types.ObjectId.isValid(userId) || files.length <= 0) {
      throw new BadRequestException()
    }

    const ids = await this.storageService.store(files, userId)

    return ids
  }

  @Post('folder')
  @Roles(Role.User)
  async createFolder(
    @Request() req,
    @Body() body
  ): Promise<any> {
    const userId = req.user?.userId
    const {
      name,
      parentId,
      type,
    } = body

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException()
    }

    const folder = await this.storageService.createFolder({
      originalname: name,
      parentId,
      type,
      userId,
    })

    return {
      _id: folder._id,
      originalName: folder.originalName,
      parentId: folder.parentId,
      type: folder.type,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
    }
  }

  @Post('list')
  @Roles(Role.User)
  async getFiles(
    @Request() req,
    @Body() body
  ): Promise<Storage[]> {
    const userId = req.user?.userId

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException()
    }

    const {
      query = {},
      pagination
    } = body

    const files = await this.storageService.getFiles({
      ...query,
      userId
    }, pagination)

    const docs = files?.docs?.map((file) => ({
      id: file._id,
      name: file.originalName,
      baseName: file.baseName,
      extName: file.extName,
      mimeType: file.mimeType,
      encoding: file.encoding,
      size: file.size,
      parentId: file.parentId,
      type: file.type,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    }))

    return {
      ...files,
      docs
    }
  }

  @Post('path')
  @Roles(Role.User)
  async getPath(
    @Request() req,
    @Body() body
  ): Promise<any[]> {
    const userId = req.user?.userId
    const { fileId } = body

    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(fileId)) {
      throw new BadRequestException()
    }

    const files = await this.storageService.getPath(fileId, userId)

    return files.reverse()
  }

  @Get(':id')
  @Roles(Role.User)
  async getFile(
    @Param('id') id: string,
    @Request() req,
    @Response({ passthrough: true }) res
  ): Promise<BadRequestException | StreamableFile | string> {
    const userId = req.user?.userId

    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException()
    }

    const {
      doc,
      stream
    } = await this.storageService.getFile(id, userId)
    const filename = doc?.originalName
      ? doc?.originalName
      : doc?.extName ? doc?._id + doc?.extName : null

    if (filename) {
      this.logger.log(`download file with filename: ${filename}`)
      res.set({
        'Content-Disposition': contentDisposition(filename)
      })
    }

    if (doc) {
      res.set({
        'Content-Type': doc?.mimeType,
        'ETag': doc?.MD5Hash,
      })
    }

    const file = stream ? new StreamableFile(stream as ReadStream) : ''

    return file
  }

  @Delete(':id')
  @Roles(Role.User)
  async removeFile(
    @Param('id') id: string,
    @Request() req,
  ): Promise<BadRequestException | string > {
    const userId = req.user?.userId

    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException()
    }

    const result = await this.storageService.removeFile(id, userId)

    return result
  }
}
