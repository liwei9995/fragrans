import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from './config/config.module'
import { ConfigService } from './config/config.service'
import { MongooseModule } from '@nestjs/mongoose'
import { StorageModule } from './storage/storage.module'
import { UsersModule } from './users/users.module'
import { LoggingInterceptor } from './common/interceptor/logging.interceptor'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { RolesGuard } from './common/guard/roles.guard'

@Module({
  imports: [
    ConfigModule.register(),
    MongooseModule.forRootAsync({
      imports: [ ConfigModule.register() ],
      useFactory: async (configService: ConfigService) => {
        const dbConfig = configService.get('db.mongo') as {
          username: string
          password: string
          database: string
          url: string
          port: number
        }
        const username = dbConfig?.username
        const password = dbConfig?.password
        const url = dbConfig?.url
        const port = dbConfig?.port
        const database = dbConfig?.database

        return {
          uri: `mongodb://${username}:${password}@${url}:${port}/${database}?authSource=admin`,
        }
      },
      inject: [ ConfigService ],
    }),
    AuthModule,
    UsersModule,
    StorageModule
  ],
  controllers: [ AppController ],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ],
})
export class AppModule {}
