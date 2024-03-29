import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './services/vehicles.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { CacheModule } from '@nestjs/cache-manager';
import { createMock } from '@golevelup/ts-jest';
import { VehicleInfo } from './types/vehicle-info';
import { LoggingService } from 'src/shared/services/logging/logging.servcie';

describe('VehiclesController', () => {
  let sut: VehiclesController;

  let mockVehiclesService = createMock<VehiclesService>();
  let mpockPrismaService = createMock<PrismaService>();
  let mockLoggingService = createMock<LoggingService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [VehiclesController],
      providers: [
        { provide: PrismaService, useValue: mpockPrismaService },
        { provide: VehiclesService, useValue: mockVehiclesService },
        { provide: LoggingService, useValue: mockLoggingService },
      ],
    }).compile();

    sut = module.get(VehiclesController);
    mockVehiclesService = module.get(VehiclesService);
    mpockPrismaService = module.get(PrismaService);
    mockLoggingService = module.get(LoggingService);
  });

  describe('root', () => {
    it('should return expected', async () => {
      const expected: VehicleInfo = {
        id: 1,
        model: 'Model',
        make: 'Golf',
        state: 'quoted',
        timeStamp: '2022-09-12 10:00:00+00',
      };
      mockVehiclesService.getVehicleInfo.mockResolvedValueOnce(expected);

      expect(
        await sut.getVehicleInfo(
          {
            id: 1,
          },
          { time: new Date('2022-09-12 10:00:00+00') },
        ),
      ).toEqual(expected);
    });
  });
});
