import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
    username: string

  @IsNotEmpty()
  @IsString()
    password: string

  @IsString()
    firstName: string

  @IsString()
    lastName: string

  @IsNumber()
    gender: number

  @IsNumber()
    age: number

  @IsString()
    avatar: string

  @IsEmail()
    email: string

  roles?: string[]
}
