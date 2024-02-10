import { Type } from 'class-transformer';
import { IsDate, IsInt, IsNotEmpty } from 'class-validator';

export class GetVehicleInfoParams {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  id: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  timeStamp: Date;
}
