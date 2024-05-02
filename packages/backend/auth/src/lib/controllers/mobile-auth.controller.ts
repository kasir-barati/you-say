import { ErrorResponseDto } from '@backend/common';
import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { MobileLoginResponseDto } from '../dtos/mobile-login-response.dto';
import { MobileLoginDto } from '../dtos/mobile-login.dto';
import { MobileRegisterDto } from '../dtos/mobile-register.dto';
import { MobileAuthService } from '../services/mobile-auth.service';

@ApiTags('Mobile Auth')
@Controller('auth/mobile')
export class MobileAuthController {
  constructor(
    private readonly mobileAuthService: MobileAuthService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'This endpoint creates a new user in FusionAuth.',
  })
  @ApiCreatedResponse({
    description:
      'Returns nothing. Use http status code 201 to indicate success.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description:
      'Bad request; email already exists, or name is invalid, etc.',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Internal server error',
  })
  async register(
    @Body() mobileRegisterDto: MobileRegisterDto,
  ): Promise<void> {
    await this.mobileAuthService.register({
      ...mobileRegisterDto,
      groups: [],
    });
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Login users from mobile devices.',
    description:
      'This endpoint will receive user credentials and exchanged them fo tokens with OAuth server.',
  })
  @ApiOkResponse({
    type: MobileLoginResponseDto,
    description: 'Returns generated tokens.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Bad request; email or password is invalid, etc.',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Internal server error.',
  })
  async login(
    @Body() mobileLoginDto: MobileLoginDto,
  ): Promise<MobileLoginResponseDto> {
    const tokens = await this.mobileAuthService.login(mobileLoginDto);

    return tokens;
  }
}
