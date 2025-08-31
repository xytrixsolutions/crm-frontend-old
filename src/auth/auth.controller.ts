import { Body, Controller, Post, HttpStatus, Req, Ip } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin-dto';
import { CustomException } from '../common/exceptions/custom-exception';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { Public } from '../common/annotations/public.decorator';
import { Request } from 'express';
import { SuccessMessage } from '../common/annotations/success-message.decorator';
import { SuccessCode } from '../common/annotations/success-code.decorator';
import { Status } from '../common/enums/status.enum';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @SuccessMessage('User logged in successfully')
  @Post('login')
  async signIn(@Req() req: Request, @Body() signInDto: SignInDto) {
    const forwarded = req.headers['x-forwarded-for'];
    const ipAddress =
      typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.ip;

    const loginResponse = await this.authService.signIn({
      ...signInDto,
      ipAddress: ipAddress ?? '',
    });
    if (!loginResponse) {
      throw new CustomException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return loginResponse;
  }

  @Public()
  @SuccessMessage('User registerd successfully')
  @SuccessCode(201)
  @Post('register')
  async create(@Ip() ipAddress: string, @Body() createUserDto: CreateUserDto) {
    const status = Status.PENDING;
    const user = await this.authService.create({
      ...createUserDto,
      status,
      ipAddress,
    });
    return user;
  }

  @SuccessMessage('Logged out successfully')
  @Post('logout')
  async logout(@Req() req: Request) {
    const user = req.user as { sub: number; email: string };
    await this.authService.logout(user.sub);
    return null;
  }

  @Post('refresh')
  @Public()
  @SuccessMessage('Token refreshed successfully')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new CustomException(
        'Refresh token is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const tokens = await this.authService.refreshTokens(refreshToken);
    return tokens;
  }

  // reset password

  // verify email
}
