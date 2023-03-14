import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { MongooseModule } from '@nestjs/mongoose'
import { StorageController } from './storage.controller'
import { StorageService } from './storage.service'
import { Storage, StorageSchema } from './schemas/storage.schema'
import StorageClass from './models/storage.model'
import { ConfigModule } from '../config/config.module'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'

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
    ConfigModule.register(),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [ StorageController ],
  providers: [ StorageService ],
  exports: [ StorageService ],
})
export class StorageModule {}
