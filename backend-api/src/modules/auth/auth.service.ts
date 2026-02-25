import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './login.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userService.findByUsername(dto.username);

    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) throw new UnauthorizedException();

    const accessPayload = { sub: user.id, type: 'access' };
    const refreshPayload = { sub: user.id, type: 'refresh' };

    const accessToken = this.jwtService.sign(accessPayload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_TOKEN_EXPIRES'),
    });

    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_TOKEN_EXPIRES'),
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.userService.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      userId: user.id,
      accessToken, // trả về để controller set cookie
      refreshToken, // trả về để controller set cookie
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      if (!payload?.sub || payload.type !== 'refresh') {
        throw new UnauthorizedException();
      }

      const user = await this.userService.findOne(payload.sub);
      if (!user || !user.hashedRefreshToken) {
        throw new UnauthorizedException();
      }

      const isMatch = await bcrypt.compare(
        refreshToken,
        user.hashedRefreshToken,
      );

      if (!isMatch) {
        throw new UnauthorizedException();
      }

      const newAccessToken = this.jwtService.sign(
        { sub: user.id, type: 'access' },
        {
          secret: this.config.get('JWT_ACCESS_SECRET'),
          expiresIn: this.config.get('JWT_ACCESS_TOKEN_EXPIRES'),
        },
      );

      const newRefreshToken = this.jwtService.sign(
        { sub: user.id, type: 'refresh' },
        {
          secret: this.config.get('JWT_REFRESH_SECRET'),
          expiresIn: this.config.get('JWT_REFRESH_TOKEN_EXPIRES'),
        },
      );

      const newHashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

      await this.userService.updateRefreshToken(user.id, newHashedRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      console.error('Refresh error:', error);
      throw new UnauthorizedException();
    }
  }

  async logout(userId: number) {
    // Xóa refresh token trong DB
    await this.userService.updateRefreshToken(userId, '');

    return { message: 'Logged out successfully' };
  }
}
