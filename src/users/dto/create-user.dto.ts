import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsMobilePhone,
  IsArray,
  MaxLength
} from 'class-validator'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
    email: string

  @IsNotEmpty()
  @IsString()
    password: string

  @IsString()
  @IsOptional()
  @MaxLength(30)
    firstName: string

  @IsString()
  @IsOptional()
  @MaxLength(30)
    lastName: string

  @IsNumber()
  @IsOptional()
    gender: number

  @IsNumber()
  @IsOptional()
    age: number

  @IsString()
  @IsOptional()
    avatar: string

  @IsMobilePhone('zh-CN')
  @IsOptional()
    phone: string

  @IsArray()
  @IsOptional()
    roles: string[]
}
