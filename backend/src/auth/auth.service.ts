import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../schemas/user.schema';
import { SignupDto } from './dto/signup.dto';

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

    const token = this.generateToken(user);
    return { access_token: token, user: this.usersService.sanitize(user) };
  }

  async login(user: UserDocument) {
    const token = this.generateToken(user);
    return { access_token: token, user: this.usersService.sanitize(user) };
  }

  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;
    return user;
  }

  async refresh(user: { id: string }) {
    const fresh = await this.usersService.findById(user.id);
    if (!fresh) throw new UnauthorizedException('User not found');
    const token = this.generateToken(fresh);
    return { access_token: token, user: this.usersService.sanitize(fresh) };
  }

  private generateToken(user: UserDocument): string {
    const payload = { sub: (user._id as any).toString(), email: user.email, role: user.role };
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        'JWT_SECRET',
        'nexusai_super_secret_key_2024',
      ),
      expiresIn: '7d' as const,
    });
  }
}
