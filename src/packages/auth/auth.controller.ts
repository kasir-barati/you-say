import { Controller, Post, Body } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserRequestDto } from './dto/request/login-user-request.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    login(@Body() loginUser: LoginUserRequestDto) {
        return this.authService.login(loginUser);
    }
}
