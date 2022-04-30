import {
  IsNumber,
  IsOptional,
  IsString,
  IsMobilePhone,
  IsArray,
  MaxLength
} from 'class-validator'

export class UpdateUserDto {
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
