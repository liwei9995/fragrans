import { Logger, ValidationPipe, VersioningType } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'
import * as config from 'config'

const port = config.get<number>('http.port') || 3000
const logger = new Logger('NestApplicationMain')

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Starts listening for shutdown hooks
  app.enableShutdownHooks()

  // Add global validation pipe
  app.useGlobalPipes(new ValidationPipe())

  // Add default version
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })

  app.use(helmet())
  app.enableCors({ origin: '*' })

  await app.listen(port)

  logger.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
