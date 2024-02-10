import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { VehicleInfo } from '../types/vehicle-info';
import { StateLogModel } from '../types/state-log';

@Injectable()
export class VehiclesService {
  constructor(private prismaService: PrismaService) {}

  public async getVehicleInfo(
    vehicleId: number,
    timeStamp: Date,
  ): Promise<VehicleInfo> {
    const time = new Date(timeStamp);
    const [vehicle, vehicleStateLog] = await Promise.all([
      this.prismaService.vehicles
        .findFirstOrThrow({
          where: { id: vehicleId },
          select: { id: true, make: true, model: true },
        })
        .catch(() => {
          throw new NotFoundException('Not found');
        }),
      this.getVehicleStateLog(vehicleId, time).catch(() => {
        throw new InternalServerErrorException();
      }),
    ]);

    return {
      ...vehicle,
      state: vehicleStateLog.state,
      timeStamp: vehicleStateLog.timestamp,
    };
  }

  private async getVehicleStateLog(
    vehicleId: number,
    time: Date,
  ): Promise<StateLogModel | null> {
    const stateLogs = await this.prismaService.$queryRaw<StateLogModel[]>(
      Prisma.sql`SELECT * FROM "stateLogs" WHERE "vehicleId" = ${vehicleId} AND "timestamp" <= ${time} ORDER BY timestamp DESC LIMIT 1`,
    );

    if (!stateLogs.length) {
      return null;
    }

    return stateLogs[0];
  }
}
