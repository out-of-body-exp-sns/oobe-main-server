import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { IUser } from './dto/User';
import { appEvents } from './app.events';

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer() server: Server;

  constructor() {
    // 데이터 업데이트 이벤트 구독
    appEvents.on('allUsers-state-update', (updatedData) => {
      this.broadcastAllUsersState(updatedData);
    });
  }

  @SubscribeMessage('message-to-server')
  handleMessage(client: Socket, payload: IUser): void {
    console.log(`Message from client: ${payload.id}`);
    appEvents.emit('user-state-update', payload);
  }

  private broadcastAllUsersState(message: Array<IUser>): void {
    this.server.emit('message-to-client', message);
  }
}
