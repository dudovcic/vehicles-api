import type { ClientOpts as RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { loggingConfig } from './shared/services/logging/config';

@Module({
  imports: [
    WinstonModule.forRoot(loggingConfig),
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        host: config.get('REDIS_HOST'),
        port: config.get('REDIS_PORT'),
        ttl: config.get('REDIS_CACHE_TTL'),
      }),
      inject: [ConfigService],
      isGlobal: true,
    }),
    VehiclesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
