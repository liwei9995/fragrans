import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LoggingInterceptor } from './common/interceptor/logging.interceptor'

@Module({
  imports: [],
  controllers: [ AppController ],
  providers: [ AppService, {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor
  }],
})
export class AppModule {}
