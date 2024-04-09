import { ErrorResponse } from '@backend/common';
import {
  Body,
  Controller,
  Get,
  HttpRedirectResponse,
  InternalServerErrorException,
  Post,
  Redirect,
  Res,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
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

  @Get('login')
  @Redirect()
  @ApiOperation({
    summary:
      'This endpoint creates login URL with all necessary configurations.',
  })
  @ApiOkResponse({
    description:
      'User will be redirected to the generated login URL.',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Internal server error',
  })
  login(@Res() response: Response): HttpRedirectResponse {
    const loginRedirectUrl = this.authService.login(response);

    return {
      statusCode: 302,
      url: loginRedirectUrl,
    };
  }
}
