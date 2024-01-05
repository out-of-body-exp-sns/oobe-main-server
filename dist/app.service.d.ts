import { Redis } from 'ioredis';
import { AppGateway } from './app.gateway';
import { IUser } from './dto/User';
export declare class AppService {
    private readonly redisClient;
    private readonly appGateway;
    constructor(redisClient: Redis, appGateway: AppGateway);
    getHello(): string;
    updateLocation(user: IUser): Promise<boolean>;
    fetchAllUsersFromRedis(): Promise<IUser[]>;
    private deleteDisconnectUser;
}
