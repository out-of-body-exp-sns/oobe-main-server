import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';

@Injectable()
export class AppService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  getHello(): string {
    return 'Hello World!';
  }

  async updateLocation(
    id: string,
    name: string,
    lat: number,
    lng: number,
  ): Promise<boolean> {
    try {
      // geoadd 명령으로 위치 추가
      await this.redisClient.geoadd(id, lng, lat, name);

      // geopos 명령으로 위치 검색 (선택적)
      const position = await this.redisClient.geopos(id, name);
      console.log(position); // 위치 로그 출력

      return true;
    } catch (err) {
      console.error(err);
      throw err; // 에러를 던짐
    }
    // return new Promise((resolve, reject) => {
    //   this.redisClient.geoadd(id, lng, lat, name, (err) => {
    //     if (err) {
    //       console.error(err);
    //       reject(err);
    //     } else {
    //       resolve(true);
    //     }
    //   });

    //   this.redisClient.get(id, (err, result) => {
    //     if (err) {
    //       console.error(err);
    //       reject(err);
    //     } else {
    //       resolve(true);
    //       console.log(result);
    //     }
    //   });
    // });
  }
}
