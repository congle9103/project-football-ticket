import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request & { cookies: any }) => req.cookies?.accessToken,
      ]),
      ignoreExpiration: false, // hết hạn thì không chấp nhận
      secretOrKey: config.get('JWT_ACCESS_SECRET', 'fallback-secret'),
    });
  }

  validate(payload: any) {
    // payload là dữ liệu bạn sign lúc tạo token
    return { userId: payload.sub };
  }
}
