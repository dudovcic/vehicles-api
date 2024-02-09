import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from './vehicles.controller';
import { VehiclesService } from './services/vehicles.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CacheModule } from '@nestjs/cache-manager';
import { createMock } from '@golevelup/ts-jest';

describe('VehiclesController', () => {
  let sut: VehiclesController;

  let mockVehiclesService = createMock<VehiclesService>();
  let mpockPrismaService = createMock<PrismaService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [VehiclesController],
      providers: [
        { provide: PrismaService, useValue: mpockPrismaService },
        { provide: VehiclesService, useValue: mockVehiclesService },
      ],
    }).compile();

    sut = module.get(VehiclesController);
    mockVehiclesService = module.get(VehiclesService);
    mpockPrismaService = module.get(PrismaService);
  });

  describe('root', () => {
    it('should throw 500 if query fails', async () => {
      const expected = {
        id: 1,
        model: 'Model',
        make: 'Golf',
        state: 'quoted',
        timestamp: '2022-09-12 10:00:00+00',
      };
      mockVehiclesService.getVehicleInfo.mockResolvedValueOnce(expected);

      expect(
        await sut.getVehicleInfo({
          id: 1,
          timestamp: new Date('2022-09-12 10:00:00+00'),
        }),
      ).toEqual(expected);
    });
  });
});
