import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, minlength: 2 })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['user', 'guest'], default: 'user' })
  role: 'user' | 'guest';

  @Prop({ type: String, select: false, default: null })
  refreshTokenHash?: string | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
