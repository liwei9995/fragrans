import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common'
import { AppService } from './app.service'
import { AuthService } from './auth/auth.service'
import { LocalAuthGuard } from './auth/local-auth.guard'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { Public } from './common/decorator/auth.decorator'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user
  }
}
