import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('update-user-state')
  async postUserState(
    @Body('id') id: string,
    @Body('name') name: string,
    @Body('lat') lat: number,
    @Body('lng') lng: number,
    @Res() res,
  ) {
    try {
      await this.appService.updateLocation(id, name, lat, lng);
      res.status(HttpStatus.OK).send('User State updated successfully');
    } catch (err) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Error updating user state');
    }
  }
}
