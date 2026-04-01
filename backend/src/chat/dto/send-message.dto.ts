import {
  IsString,
  IsOptional,
  IsArray,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class ChatHistoryItemDto {
  @ApiProperty({ enum: ['user', 'assistant'], example: 'user' })
  role: 'user' | 'assistant';

  @ApiProperty({ example: 'Can you help me summarize this file?' })
  content: string;
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
}
