import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from '../vehicles.controller';
import { VehiclesService } from './vehicles.service';
import { PrismaService } from 'src/shared/services/prisma.service';
import { CacheModule } from '@nestjs/cache-manager';
import { createMock } from '@golevelup/ts-jest';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('VehiclesController', () => {
  let sut: VehiclesService;

  let prismaMock = createMock<PrismaService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [VehiclesController],
      providers: [
        { provide: PrismaService, useValue: prismaMock },
        VehiclesService,
      ],
    }).compile();

    sut = module.get(VehiclesController);
    prismaMock = module.get(PrismaService);
  });

  describe('root', () => {
    prismaMock.vehicles.findFirstOrThrow = jest.fn(() => {
      throw new NotFoundException('Not found');
    });
    it('should throw not found if cant find a vehicle', async () => {
      try {
        await sut.getVehicleInfo(1, new Date('2022-09-12 10:00:00+00'));
      } catch (e) {
        expect(e.message).toEqual('Not found');
      }
    });

    it('should throw internal if querying logs fails', async () => {
      prismaMock.vehicles.findFirstOrThrow = createMock(async () => ({
        id: 1,
      }));
      prismaMock.$queryRaw.mockRejectedValue(
        new InternalServerErrorException('Error'),
      );

      try {
        await sut.getVehicleInfo(1, new Date('2022-09-12 10:00:00+00'));
      } catch (e) {
        expect(e.message).toEqual('Internal Server Error');
      }
    });
    it('should return vehicle info', async () => {
      prismaMock.vehicles.findFirstOrThrow = createMock(async () => ({
        id: 1,
        make: 'VW',
        model: 'Golf',
      }));
      prismaMock.$queryRaw.mockResolvedValueOnce([
        { state: 'selling', timestamp: '2022-09-12 10:00:00+00' },
      ]);

      const result = await sut.getVehicleInfo(
        1,
        new Date('2022-10-12 10:00:00+00'),
      );
      expect(result).toEqual({
        id: 1,
        make: 'VW',
        model: 'Golf',
        state: 'selling',
        timestamp: '2022-09-12 10:00:00+00',
      });
    });
  });
});
