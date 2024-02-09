import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/health')
  healthCheck() {
    return HttpStatus.OK;
  }
}
