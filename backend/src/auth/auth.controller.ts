import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from './public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Post('signup')
  async signup(@Body() dto: SignupDto, @Res({ passthrough: true }) response: Response) {
    const session = await this.authService.signup(dto);
    this.setRefreshCookie(response, session.refreshToken);
    return { access_token: session.accessToken, user: session.user };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const session = await this.authService.login(user);
    this.setRefreshCookie(response, session.refreshToken);
    return { access_token: session.accessToken, refresh_token: session.refreshToken, user: session.user };
  }

  @Get('me')
  @ApiBearerAuth('bearer')
  getMe(@Req() req: any) {
    return { user: req.user };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const session = await this.authService.refresh(refreshToken);
    this.setRefreshCookie(response, session.refreshToken);
    return { access_token: session.accessToken, user: session.user };
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(request.cookies?.refresh_token);
    response.clearCookie('refresh_token', this.getRefreshCookieOptions());
    return { success: true };
  }

  private setRefreshCookie(response: Response, refreshToken: string) {
    response.cookie(
      'refresh_token',
      refreshToken,
      this.getRefreshCookieOptions(),
    );
  }

  private getRefreshCookieOptions() {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    return {
      httpOnly: true,
      sameSite: isProduction ? 'none' as const : 'lax' as const,
      secure: isProduction,
      path: '/api/auth',
      maxAge: this.authService.getRefreshCookieMaxAge(),
    };
  }
}
