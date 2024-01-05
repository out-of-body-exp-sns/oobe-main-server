import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: 'redis://' + process.env.REDIS_HOST + ':' + process.env.REDIS_PORT,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
