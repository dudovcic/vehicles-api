import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma.service';

interface StateLogModel {
  state: string;
  vehicleId: string;
  timestamp: string;
}

@Injectable()
export class VehiclesService {
  constructor(private prismaService: PrismaService) {}

  public async getVehicleInfo(vehicleId: number, timeStamp: Date) {
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
      this.getVehicleStateLog(vehicleId, time),
    ]);

    const vehicleResponse = {
      ...vehicle,
      state: vehicleStateLog.state,
      timestamp: vehicleStateLog.timestamp,
    };

    return vehicleResponse;
  }

  private async getVehicleStateLog(
    vehicleId: number,
    time: Date,
  ): Promise<StateLogModel | null> {
    const logs = await this.prismaService
      .$queryRaw<StateLogModel[]>(
        Prisma.sql`SELECT * FROM "stateLogs" WHERE "vehicleId" = ${vehicleId} AND "timestamp" <= ${time} ORDER BY timestamp DESC LIMIT 1`,
      )
      .catch(() => {
        throw new InternalServerErrorException();
      });

    if (!logs.length) {
      return null;
    }

    return logs[0];
  }
}
