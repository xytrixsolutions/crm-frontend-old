import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/annotations/public.decorator';

@Public()
@Controller('health')
export class HealthController {
  @Get()
  getHealth(): string {
    return 'OK';
  }
}
