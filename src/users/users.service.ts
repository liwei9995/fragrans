import { Model } from 'mongoose'
import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
  Logger,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './schemas/user.schema'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UsersService implements OnModuleInit, OnApplicationShutdown {
  private readonly logger = new Logger(UsersService.name)

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  onModuleInit() {
    this.logger.log('The users module has been initialized.')
  }

  onApplicationShutdown(signal: string) {
    this.logger.log(`Received application shutdown signal: ${signal}`) // e.g. "SIGNINT"
  }

  async findAll(select = '-password'): Promise<User[]> {
    return this.userModel.find().select(select).exec()
  }

  async findOne(query = {}, select = '-password'): Promise<User | undefined> {
    return this.userModel.findOne(query).select(select).lean()
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto)

    return (await createdUser.save()).toJSON()
  }

  async deleteAll() {
    return this.userModel.deleteMany()
  }
}
