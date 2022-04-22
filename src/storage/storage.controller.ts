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
  Param,
  Logger
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
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    const ids = await this.storageService.store(files)

    return ids
  }

  @Get(':id')
  @Roles(Role.User)
  async getFile(
    @Param('id') id: string,
    @Request() req,
    @Response({ passthrough: true }) res
  ): Promise<StreamableFile | string> {
    const userId = req.user?.userId

    if (!Types.ObjectId.isValid(id) || !userId) {
      throw new BadRequestException()
    }

    const {
      doc,
      stream
    } = await this.storageService.getFile(id, userId)
    const filename = doc?.originalName
      ? doc?.originalName
      : doc?.extName ? doc?.id + doc?.extName : null

    if (filename) {
      this.logger.log(`download file with filename: ${filename}`)
      res.set({
        'Content-Disposition': contentDisposition(filename)
      })
    }

    if (doc) {
      res.set({
        'Content-Type': doc?.contentType,
        'Last-Modified': doc?.dateModified,
        'ETag': doc?.MD5Hash,
      })
    }

    const file = stream ? new StreamableFile(stream as ReadStream) : ''

    return file
  }
}
