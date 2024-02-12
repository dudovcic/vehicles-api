import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty } from 'class-validator';

export class GetVehicleInfoRouteParams {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  id: number;
}

export class GetVehicleInfoQueryParams {
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  time: Date;
}
