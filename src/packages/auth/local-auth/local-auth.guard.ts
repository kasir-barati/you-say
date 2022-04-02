import { AuthGuard } from '@nestjs/passport';
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalAuthGuard
    extends AuthGuard('local')
    implements CanActivate
{
    constructor(private authService: AuthService) {
        super();
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        // TODO: log the attempt to login into user account
        console.log(request);
        return true;
    }

    async validate(username: string, password: string) {
        const user = this.authService.loginValidate({
            username,
            password,
        });

        if (!(await user)) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
