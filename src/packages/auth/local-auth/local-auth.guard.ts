import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LocalAuthGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        // TODO: log the attempt to login into user account
        console.log(request);
        return true;
    }
}
