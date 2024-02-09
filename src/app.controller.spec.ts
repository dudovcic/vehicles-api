import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { PrismaService } from './shared/services/prisma.service';
import { CacheModule } from '@nestjs/cache-manager';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [AppController],
      providers: [PrismaService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should be healthy', async () => {
      expect(await appController.healthCheck()).toBe(200);
    });
  });
});
