import { Controller, Param, Sse } from '@nestjs/common';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse('subscribe/:userId')
  subscribe(@Param('userId') userId: string): Observable<any> {
    return this.sseService.subscribe(userId);
  }
}
