import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './login.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userService.findByUsername(dto.username);

    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(dto.password, user.password);

    if (!isMatch) throw new UnauthorizedException();

    const payload = { sub: user.id };

    const refreshToken = this.jwtService.sign(payload);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await this.userService.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken, // trả về để controller set cookie
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const user = await this.userService.findOne(payload.sub);
      if (!user || !user.hashedRefreshToken) {
        throw new UnauthorizedException();
      }

      const isMatch = await bcrypt.compare(
        refreshToken,
        user.hashedRefreshToken,
      );

      if (!isMatch) throw new UnauthorizedException();

      const newAccessToken = this.jwtService.sign({ sub: user.id });

      const newRefreshToken = this.jwtService.sign({ sub: user.id });

      const newHashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

      await this.userService.updateRefreshToken(user.id, newHashedRefreshToken);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
