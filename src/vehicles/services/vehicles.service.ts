import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { VehicleInfo } from '../types/vehicle-info';
import { StateLogModel } from '../types/state-log.model';
import { LoggingService } from 'src/shared/services/logging/logging.servcie';
import { Logger } from 'winston';

@Injectable()
export class VehiclesService {
  private logger: Logger;
  constructor(
    private prismaService: PrismaService,
    loggingService: LoggingService,
  ) {
    this.logger = loggingService.getChildLogger(VehiclesService.name);
  }

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
          this.logger.error('no vehicles found', { vehicleId });
          throw new NotFoundException('Not found');
        }),
      this.getVehicleStateLog(vehicleId, time).catch((e) => {
        this.logger.error('failed getting state log', e);
        throw new InternalServerErrorException();
      }),
    ]);

    if (!vehicleStateLog) {
      throw new NotFoundException('No state log for vehicle');
    }

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
    // Raw query as Prisma can't handle tables without a unique key
    const stateLogs = await this.prismaService.$queryRaw<StateLogModel[]>(
      Prisma.sql`SELECT * FROM "stateLogs" 
        WHERE "vehicleId" = ${vehicleId}
        AND "timestamp" <= ${time}
        ORDER BY timestamp DESC
        LIMIT 1`,
    );

    if (!stateLogs.length) {
      return null;
    }

    return stateLogs[0];
  }
}
