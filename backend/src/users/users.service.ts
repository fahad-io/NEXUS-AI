import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

export type { User };

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async create(data: {
    email: string;
    name: string;
    password: string;
    role?: 'user' | 'guest';
  }): Promise<UserDocument> {
    const user = new this.userModel({
      email: data.email.toLowerCase(),
      name: data.name,
      password: data.password,
      role: data.role ?? 'user',
    });
    return user.save();
  }

  async update(id: string, data: Partial<User>): Promise<UserDocument | null> {
    return this.userModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  sanitize(user: UserDocument): { id: string; email: string; name: string; role: string } {
    return {
      id: (user._id as any).toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }
}
