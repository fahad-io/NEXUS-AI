import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Request,
  Headers,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { CreateSessionDto } from './dto/create-session.dto';
import { Public } from '../auth/public.decorator';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  /**
   * Send a message. Works for authenticated users and guests.
   * Guests must supply an X-Session-Id header (or provide sessionId in body).
   * If no session exists a new one is created automatically.
   */
  @Public()
  @Post('send')
  @HttpCode(HttpStatus.OK)
  async send(
    @Body() dto: SendMessageDto,
    @Request() req: any,
    @Headers('x-session-id') guestSessionId?: string,
  ) {
    const userId: string | undefined = req.user?.id;
    return this.chatService.sendMessage(dto, userId, guestSessionId);
  }

  /** Create a new session (authenticated users) */
  @Post('session')
  @ApiBearerAuth('bearer')
  createSession(@Body() dto: CreateSessionDto, @Request() req: any) {
    const session = this.chatService.createSession(
      req.user.id,
      dto.modelId,
      dto.title,
    );
    return { sessionId: session.id, session };
  }

  /** Delete a session (authenticated users) */
  @Delete('session/:id')
  @ApiBearerAuth('bearer')
  deleteSession(@Param('id') id: string, @Request() req: any) {
    const deleted = this.chatService.deleteSession(id, req.user.id);
    if (!deleted)
      throw new NotFoundException('Session not found or access denied');
    return { success: true };
  }

  /** Return paginated chat history for the authenticated user */
  @Get('history')
  @ApiBearerAuth('bearer')
  getHistory(
    @Request() req: any,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.chatService.getChatHistory(
      req.user.id,
      Number(page),
      Number(limit),
    );
  }
}
