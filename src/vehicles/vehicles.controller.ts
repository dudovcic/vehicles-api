import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { VehiclesService } from './services/vehicles.service';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { LoggingService } from 'src/shared/services/logging/logging.servcie';
import { Logger } from 'winston';
import { GetVehicleInfoParams } from './types/get-vehicles-info.request';

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
