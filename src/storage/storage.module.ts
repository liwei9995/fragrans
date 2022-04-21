import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { MongooseModule } from '@nestjs/mongoose'
import { StorageController } from './storage.controller'
import { StorageService } from './storage.service'
import { Storage, StorageSchema } from './schemas/storage.schema'
import StorageClass from './models/storage.model'

@Module({
  imports: [
    MulterModule,
    MongooseModule.forFeatureAsync([{
      name: Storage.name,
      useFactory: () => {
        const schema = StorageSchema

        schema.index({
          createdAt: -1
        })
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        schema.plugin(require('mongoose-paginate'))
        schema.loadClass(StorageClass)

        return schema
      }
    }]),
  ],
  controllers: [ StorageController ],
  providers: [ StorageService ],
  exports: [ StorageService ],
})
export class StorageModule {}
