import { AppService } from './app.service';
import { IUser } from './dto/User';
import { Observable } from 'rxjs';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    postUserState(userData: IUser, res: any): Promise<void>;
    streamEvents(): Observable<{
        data: IUser[];
    }>;
}
