import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { AppGateway } from './app.gateway';
import { IUser } from './dto/User';
import { appEvents } from './app.events';

@Injectable()
export class AppService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly appGateway: AppGateway,
  ) {
    appEvents.on('user-state-update', (updatedData) => {
      this.updateLocation(updatedData);
    });
  }

  getHello(): string {
    return 'Hello World!';
  }

  async updateLocation(user: IUser): Promise<boolean> {
    try {
      this.deleteDisconnectUser();

      const userJson = JSON.stringify(user);
      if (user.connect) {
        await this.redisClient.set(user.id, userJson);
        console.log('User State updated successfully : ', user.id);
      } else {
        try {
          const result = await this.redisClient.del(user.id);
          if (result === 1) {
            console.log(`Key '${user.id}' successfully deleted.`);
          } else {
            console.log(`Key '${user.id}' does not exist.`);
          }
        } catch (error) {
          console.error('Error deleting key:', error);
        }
      }

      // geopos 명령으로 위치 검색 (선택적)
      // const position = await this.redisClient.geopos(id, name);
      // console.log(position); // 위치 로그 출력

      // const data = await this.fetchAllUsersFromRedis();
      // appEvents.emit('allUsers-state-update', data);

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

  async fetchAllUsersFromRedis(): Promise<IUser[]> {
    const keys = await this.redisClient.keys('*');
    const users: IUser[] = [];

    for (const key of keys) {
      const userJson = await this.redisClient.get(key);
      if (userJson) {
        users.push(JSON.parse(userJson));
      }
    }

    return users;
  }

  private async deleteDisconnectUser(): Promise<void> {
    try {
      const keys = await this.redisClient.keys('*'); // 모든 키 검색

      for (const key of keys) {
        const value = await this.redisClient.get(key); // 각 키에 대한 값을 검색
        if (value) {
          const data = JSON.parse(value); // 문자열을 객체로 파싱

          if (!data['connect']) {
            await this.redisClient.del(key); // 조건에 맞는 키 삭제
            console.log(`Deleted key: ${key}`);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}
