import { Injectable } from '@nestjs/common';
import { LoginUserRequestDto } from './dto';

@Injectable()
export class AuthService {
    login(loginUser: LoginUserRequestDto) {
        // return this.authService.login(loginUser);
        // TODO: Log user attempt in the db
        // TODO: Send email to the user to inform them, I guess this should happen on suspicious activities
        // TODO: Pass the IP and headers to this service or use interceptor
        console.log(loginUser);
    }
}
