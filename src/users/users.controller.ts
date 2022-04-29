import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  BadRequestException,
  UseFilters,
} from '@nestjs/common'
import { Types } from 'mongoose'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { MongoExceptionFilter } from '../common/filter/mongo-exception.filter'
import { Public } from '../common/decorator/auth.decorator'
import { Role } from '../common/enums/role.enum'
import { Roles } from '../common/decorator/roles.decorator'

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @Roles(Role.Admin)
  async findAll() {
    return this.usersService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException()
    }

    const user = await this.usersService.findOne({ _id: id })

    return user
  }

  @Post(':id')
  @Roles(Role.User)
  async findOneAndUpdate(
    @Param('id') id: string,
    @Body() body: Record<string, string>
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException()
    }

    const user = await this.usersService.findOneAndUpdate({ _id: id }, body)

    return user
  }

  @Public()
  @Post()
  @UseFilters(MongoExceptionFilter)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto)

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user

      return result
    }

    return user
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async deleteOne(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException()
    }

    return this.usersService.deleteOne(id)
  }

  @Delete()
  @Roles(Role.Admin)
  async deleteAll() {
    return this.usersService.deleteAll()
  }
}
