import {
  IsString,
  IsOptional,
  IsArray,
  IsIn,
  IsNumber,
  MinLength,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class ChatHistoryItemDto {
  @ApiProperty({ enum: ['user', 'assistant'], example: 'user' })
  role: 'user' | 'assistant';

  @ApiProperty({ example: 'Can you help me summarize this file?' })
  content: string;
}

class MessageAttachmentDto {
  @ApiProperty({ example: 'camera-clip.webm' })
  @IsString()
  name: string;

  @ApiProperty({ example: '/uploads/camera-clip.webm' })
  @IsString()
  url: string;

  @ApiProperty({ example: 'video/webm' })
  @IsString()
  mimeType: string;

  @ApiProperty({ enum: ['image', 'video', 'file'], example: 'video' })
  @IsIn(['image', 'video', 'file'])
  kind: 'image' | 'video' | 'file';

  @ApiPropertyOptional({ example: 5242880 })
  @IsOptional()
  @IsNumber()
  size?: number;
}

export class SendMessageDto {
  @ApiProperty({
    example: 'Please summarize the architecture for me.',
    minLength: 1,
    maxLength: 10000,
  })
  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  message: string;

  @ApiProperty({ example: 'gpt-4o-mini' })
  @IsString()
  modelId: string;

  @ApiPropertyOptional({ example: '4c96e68e-6adf-4d63-b88a-0ef7d8932e96' })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiPropertyOptional({
    type: [ChatHistoryItemDto],
    description: 'Optional chat history to send alongside the current message',
  })
  @IsOptional()
  @IsArray()
  history?: { role: 'user' | 'assistant'; content: string }[];

  @ApiPropertyOptional({ enum: ['text', 'voice'], example: 'text' })
  @IsOptional()
  @IsIn(['text', 'voice'])
  type?: 'text' | 'voice';

  @ApiPropertyOptional({
    description: 'Optional audio source for voice messages. Can be a data URL or uploaded file URL.',
    example: 'data:audio/webm;base64,...',
  })
  @IsOptional()
  @IsString()
  audioUrl?: string;

  @ApiPropertyOptional({ example: 12400 })
  @IsOptional()
  @IsNumber()
  audioDurationMs?: number;

  @ApiPropertyOptional({
    type: [MessageAttachmentDto],
    description: 'Optional uploaded media or files attached to the message.',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MessageAttachmentDto)
  attachments?: MessageAttachmentDto[];
}
