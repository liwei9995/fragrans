import {
  ArgumentsHost,
  Catch,
  BadRequestException,
  ConflictException,
  ExceptionFilter,
} from '@nestjs/common'
import { MongoError } from 'mongodb'
import { Response } from 'express'

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    switch (exception.code) {
      case 11000:
        response.json(new ConflictException())
        break
      default:
        response.json(new BadRequestException())
        break
    }
  }
}
