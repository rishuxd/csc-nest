import { Controller, Param, Sse, Res } from '@nestjs/common';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';
import { Response } from 'express';

@Controller('notify/sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('subscribe/:userId')
  subscribe(
    @Param('userId') userId: string,
    @Res() res: Response,
  ): Observable<any> {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', '*');

    return this.sseService.subscribe(userId);
  }
}
