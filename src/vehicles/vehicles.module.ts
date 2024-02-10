import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './services/vehicles.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { LoggingService } from 'src/shared/services/logging/logging.servcie';

@Module({
  imports: [],
  controllers: [VehiclesController],
  providers: [LoggingService, PrismaService, VehiclesService],
})
export class VehiclesModule {}
