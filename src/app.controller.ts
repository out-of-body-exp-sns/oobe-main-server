import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  HttpStatus,
  Sse,
} from '@nestjs/common';
import { AppService } from './app.service';
import { IUser } from './dto/User';
import { Observable, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('update-user-state')
  async postUserState(@Body() userData: IUser, @Res() res) {
    try {
      await this.appService.updateLocation(userData);
      // console.log('User State updated successfully');
      res.status(HttpStatus.OK).send('User State updated successfully');
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Error updating user state');
    }
  }

  @Sse('sse')
  streamEvents(): Observable<{ data: IUser[] }> {
    return interval(1000).pipe(
      switchMap(() =>
        this.appService
          .fetchAllUsersFromRedis()
          .then((users) => ({ data: users })),
      ),
    );
  }
}
