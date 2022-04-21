import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { AnyFilesInterceptor } from '@nestjs/platform-express'
// import { Role } from '../common/enums/role.enum'
// import { Roles } from '../common/decorator/roles.decorator'
import { Public } from 'src/common/decorator/auth.decorator'
import { StorageService } from './storage.service'

@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Post('upload')
  // @Roles(Role.User)
  @Public()
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    const ids = await this.storageService.store(files)

    return ids
  }
}
