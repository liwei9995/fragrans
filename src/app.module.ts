import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from './config/config.module'
import { ConfigService } from './config/config.service'
import { LoggingInterceptor } from './common/interceptor/logging.interceptor'

@Module({
  imports: [
    ConfigModule.register(),
    MongooseModule.forRootAsync({
      imports: [ ConfigModule.register() ],
      useFactory: async (configService: ConfigService) => {
        const dbConfig = configService.get('db.mongo') as {
          username: string
          password: string
          url: string
          port: number
        }
        const username = dbConfig?.username
        const password = dbConfig?.password
        const url = dbConfig?.url
        const port = dbConfig?.port

        return {
          uri: `mongodb://${username}:${password}@${url}:${port}/`,
        }
      },
      inject: [ ConfigService ],
    }),
    AuthModule,
  ],
  controllers: [ AppController ],
  providers: [ AppService, {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor
  }],
})
export class AppModule {}
