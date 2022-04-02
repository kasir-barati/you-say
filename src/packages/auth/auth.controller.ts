import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginUserRequestDto } from './dto/request/login-user-request.dto';
import { GetUser } from '@you-say/src/shared/decorators/get-user.decorator';
import { LocalAuthGuard } from './local-auth/local-auth.guard';
import { UserWithRelations } from '../users/types/user.type';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
    @UseGuards(LocalAuthGuard)
    login(
        @Body() loginUser: LoginUserRequestDto,
        @GetUser() user: UserWithRelations,
    ) {
        return this.authService.login(user);
    }
}
