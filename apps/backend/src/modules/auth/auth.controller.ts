import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponse } from '../../shared/types/error-response.type';
import { RegisterResponseDto } from './dtos/register-response.dto';
import { RegisterDto } from './dtos/register.dto';
import { AuthService } from './services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'This endpoint creates a new user in FusionAuth.',
  })
  @ApiCreatedResponse({
    type: RegisterResponseDto,
    description:
      'Returns nothing. Use http status code 201 to indicate success.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponse,
    description:
      'Bad request; email already exists, or name is invalid, etc.',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Internal server error',
  })
  async register(@Body() registerDto: RegisterDto): Promise<void> {
    await this.authService.register({
      ...registerDto,
      groups: [],
    });
  }
}
