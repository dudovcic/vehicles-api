import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { VehiclesService } from './services/vehicles.service';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty } from 'class-validator';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { LoggingService } from 'src/shared/services/logging/logging.servcie';
import { Logger } from 'winston';

class GetVehicleInfoParams {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  id: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  timeStamp: Date;
}

@Controller('vehicles')
export class VehiclesController {
  private logger: Logger;
  constructor(
    private readonly vehiclesService: VehiclesService,
    loggingService: LoggingService,
  ) {
    this.logger = loggingService.getChildLogger(VehiclesController.name);
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/:id/:timeStamp')
  getVehicleInfo(@Param() params: GetVehicleInfoParams) {
    this.logger.info('getting vehicle info');
    return this.vehiclesService.getVehicleInfo(params.id, params.timeStamp);
  }
}
