import { vehicles } from '@prisma/client';

export interface VehicleInfo extends vehicles {
  timeStamp: string;
}
