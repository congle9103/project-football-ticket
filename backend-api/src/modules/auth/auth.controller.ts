import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import type { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    // Access Token cookie (ngắn hạn)
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: false, // true khi production https
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // ví dụ 15 phút
    });

    // Refresh Token cookie (dài hạn)
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Login success',
      userId: result.userId,
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const result = await this.authService.refresh(refreshToken);

    // Ghi đè accessToken mới
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    // Ghi đè refreshToken mới
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      message: 'Refreshed successfully',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMe(@Req() req) {
    return this.userService.findOne(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const userId = req.user.userId;

    await this.authService.logout(userId);

    // Xóa cookie accessToken
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    // Xóa cookie refreshToken
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });

    return { message: 'Logout success' };
  }

  @Post('staff-login')
  async staffLogin(@Body() dto: LoginDto) {
    return this.authService.staffLogin(dto);
  }
}
