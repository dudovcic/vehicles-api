import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { VehiclesService } from './services/vehicles.service';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty } from 'class-validator';
import { CacheInterceptor } from '@nestjs/cache-manager';

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
  constructor(private readonly vehiclesService: VehiclesService) {}

  @UseInterceptors(CacheInterceptor)
  @Get('/:id/:timeStamp')
  getVehicleInfo(@Param() params: GetVehicleInfoParams) {
    return this.vehiclesService.getVehicleInfo(params.id, params.timeStamp);
  }
}
