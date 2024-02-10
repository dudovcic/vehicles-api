import { Module } from '@nestjs/common';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './services/vehicles.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';

@Module({
  imports: [],
  controllers: [VehiclesController],
  providers: [PrismaService, VehiclesService],
})
export class VehiclesModule {}
