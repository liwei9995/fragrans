import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const [ req ] = context.getArgs()
    const methodKey = context.getHandler().name
    const className = context.getClass().name
    const now = Date.now()

    return next
      .handle()
      .pipe(
        tap(() => console.log(`[${req.method}] - ${req.url} - ${methodKey} - ${className} - ${Date.now() - now}ms`))
      )
  }
}
