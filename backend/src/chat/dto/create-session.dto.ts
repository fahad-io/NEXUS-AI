import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSessionDto {
  @ApiPropertyOptional({ example: 'gpt-4o-mini' })
  @IsOptional()
  @IsString()
  modelId?: string;

  @ApiPropertyOptional({ example: 'Support Chat' })
  @IsOptional()
  @IsString()
  title?: string;
}
