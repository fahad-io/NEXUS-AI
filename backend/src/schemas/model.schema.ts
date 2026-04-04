import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ModelDocument = AIModel & Document;

@Schema({ timestamps: true })
export class AIModel {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  org: string;

  @Prop({ required: true })
  lab: string;

  @Prop({ default: '🤖' })
  icon: string;

  @Prop({ default: '#F4F2EE' })
  bg: string;

  @Prop({ default: '' })
  desc: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: '' })
  badge: string;

  @Prop({ default: '' })
  badgeClass: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviews: number;

  @Prop({ default: 'Free' })
  price: string;

  @Prop({ default: 0 })
  price_start: number;

  @Prop({ type: [String], default: [] })
  types: string[];

  @Prop({ default: '' })
  context: string;

  @Prop({ default: '' })
  latency: string;

  @Prop({ default: 'language' })
  category: string;
}

export const AIModelSchema = SchemaFactory.createForClass(AIModel);
