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
