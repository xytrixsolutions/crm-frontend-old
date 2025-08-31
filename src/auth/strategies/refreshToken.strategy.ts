/* eslint-disable @typescript-eslint/no-unsafe-return */

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private configService: ConfigService) {
    const options: StrategyOptionsWithRequest = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET') as string,
      passReqToCallback: true,
    };
    super(options);
  }

  validate(req: Request, payload: any) {
    const authHeader = req.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Refresh token not found in header');
    }

    const refreshToken = authHeader.replace('Bearer ', '').trim();
    return { ...payload, refreshToken };
  }
}
