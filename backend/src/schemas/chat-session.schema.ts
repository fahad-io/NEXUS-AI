import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatSessionDocument = ChatSession & Document;

@Schema({ _id: false })
export class MessageAttachment {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ enum: ['image', 'video', 'file'], required: true })
  kind: 'image' | 'video' | 'file';

  @Prop()
  size?: number;
}

const MessageAttachmentSchema = SchemaFactory.createForClass(MessageAttachment);

@Schema({ _id: false })
export class ChatMessage {
  @Prop({ enum: ['user', 'assistant'], required: true })
  role: 'user' | 'assistant';

  @Prop({ required: true })
  content: string;

  @Prop({ enum: ['text', 'voice'], default: 'text' })
  type?: 'text' | 'voice';

  @Prop()
  audioUrl?: string;

  @Prop()
  audioDurationMs?: number;

  @Prop({
    type: [MessageAttachmentSchema],
    default: [],
  })
  attachments?: MessageAttachment[];

  @Prop({ default: () => new Date() })
  timestamp: Date;
}

const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);

@Schema({ timestamps: true })
export class ChatSession {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  userId?: Types.ObjectId;

  @Prop({ required: true, default: 'gpt-5' })
  modelId: string;

  @Prop({ default: 'New Chat' })
  title: string;

  @Prop({ type: [ChatMessageSchema], default: [] })
  messages: ChatMessage[];

  @Prop({ default: false })
  isGuest: boolean;

  @Prop()
  expiresAt?: Date;
}

export const ChatSessionSchema = SchemaFactory.createForClass(ChatSession);

// TTL index: MongoDB auto-deletes docs when expiresAt is reached
ChatSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
