import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContactDto } from './dto/contact.dto';
import { FeedbackDto } from './dto/feedback.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('Forms')
@Public()
@Controller('forms')
export class FormsController {
  private readonly logger = new Logger(FormsController.name);

  @Post('contact')
  @HttpCode(HttpStatus.OK)
  submitContact(@Body() dto: ContactDto) {
    this.logger.log(
      `Contact form submission — name: ${dto.name}, email: ${dto.email}`,
    );
    return {
      success: true,
      message: 'Thank you for contacting us! We will get back to you shortly.',
    };
  }

  @Post('feedback')
  @HttpCode(HttpStatus.OK)
  submitFeedback(@Body() dto: FeedbackDto) {
    this.logger.log(
      `Feedback received — rating: ${dto.rating}/5, page: ${dto.page ?? 'unknown'}`,
    );
    return { success: true, message: 'Thank you for your feedback!' };
  }
}
