import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { Public } from '../common/decorator/auth.decorator'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ username }, '+password')

    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user

      return result
    }

    return null
  }

  @Public()
  async login(req: any) {
    const user = req?.user
    const payload = {
      username: user?.username,
      sub: user?._id,
      roles: user?.roles,
    }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
