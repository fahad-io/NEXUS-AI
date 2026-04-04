import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import type { StringValue } from 'ms';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../schemas/user.schema';
import { SignupDto } from './dto/signup.dto';

interface AuthTokenPayload {
  sub: string;
  email: string;
  role: string;
}

interface AuthSessionResult {
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; name: string; role: string };
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(dto: SignupDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      name: dto.name,
      password: hashed,
      role: 'user',
    });

    return this.createAuthSession(user);
  }

  async login(user: UserDocument) {
    return this.createAuthSession(user);
  }

  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;
    return user;
  }

  async refresh(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken);
    const user = await this.usersService.findByIdWithRefreshToken(payload.sub);
    if (!user?.refreshTokenHash) {
      throw new UnauthorizedException('Refresh session not found');
    }

    const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!matches) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    return this.createAuthSession(user);
  }

  async logout(refreshToken?: string) {
    if (!refreshToken) return;

    try {
      const payload = await this.verifyRefreshToken(refreshToken);
      await this.usersService.setRefreshTokenHash(payload.sub, null);
    } catch {
      // Clearing the cookie on the client is still enough if the token is already invalid.
    }
  }

  getRefreshCookieMaxAge() {
    return this.parseDurationToMs(this.getRefreshTokenExpiresIn(), 30 * 24 * 60 * 60 * 1000);
  }

  private async createAuthSession(user: UserDocument): Promise<AuthSessionResult> {
    const payload = this.buildPayload(user);
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.getAccessTokenSecret(),
      expiresIn: this.getAccessTokenExpiresIn(),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.getRefreshTokenSecret(),
      expiresIn: this.getRefreshTokenExpiresIn(),
    });
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await this.usersService.setRefreshTokenHash(payload.sub, refreshTokenHash);

    return {
      accessToken,
      refreshToken,
      user: this.usersService.sanitize(user),
    };
  }

  private buildPayload(user: UserDocument): AuthTokenPayload {
    return {
      sub: (user._id as any).toString(),
      email: user.email,
      role: user.role,
    };
  }

  private async verifyRefreshToken(refreshToken: string): Promise<AuthTokenPayload> {
    try {
      return await this.jwtService.verifyAsync<AuthTokenPayload>(refreshToken, {
        secret: this.getRefreshTokenSecret(),
      });
    } catch {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }
  }

  private getAccessTokenSecret() {
    return this.configService.get<string>(
      'JWT_ACCESS_SECRET',
      this.configService.get<string>(
        'JWT_SECRET',
        'nexusai_super_secret_key_2024',
      ),
    );
  }

  private getRefreshTokenSecret() {
    return this.configService.get<string>(
      'JWT_REFRESH_SECRET',
      `${this.getAccessTokenSecret()}_refresh`,
    );
  }

  private getAccessTokenExpiresIn(): StringValue {
    return this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
      '15m',
    ) as StringValue;
  }

  private getRefreshTokenExpiresIn(): StringValue {
    return this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '30d',
    ) as StringValue;
  }

  private parseDurationToMs(value: string, fallbackMs: number) {
    const normalized = value.trim();
    const numeric = Number(normalized);
    if (!Number.isNaN(numeric) && numeric > 0) return numeric;

    const match = normalized.match(/^(\d+)(ms|s|m|h|d)$/i);
    if (!match) return fallbackMs;

    const amount = Number(match[1]);
    const unit = match[2].toLowerCase();
    const multipliers: Record<string, number> = {
      ms: 1,
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return amount * (multipliers[unit] ?? 1);
  }
}
