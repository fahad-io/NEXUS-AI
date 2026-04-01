import {
  IsInt,
  IsString,
  IsOptional,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FeedbackDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'The onboarding flow felt really smooth.' })
  @IsString()
  @MaxLength(2000)
  message: string;

  @ApiPropertyOptional({ example: '/pricing' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  page?: string;
}
