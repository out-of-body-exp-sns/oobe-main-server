import { Server, Socket } from 'socket.io';
import { IUser } from './dto/User';
export declare class AppGateway {
    server: Server;
    constructor();
    handleMessage(client: Socket, payload: IUser): void;
    private broadcastAllUsersState;
}
