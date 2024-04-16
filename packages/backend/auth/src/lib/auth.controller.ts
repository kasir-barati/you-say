import { Cookies, ErrorResponse } from '@backend/common';
import {
  Body,
  Controller,
  Get,
  HttpRedirectResponse,
  InternalServerErrorException,
  Post,
  Query,
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
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { OauthCallbackCookie } from './dtos/oauth-callback-cookies.dto';
import { OauthCallbackQuery } from './dtos/oauth-callback-query.dto';
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
    description:
      'Client needs to call this endpoint first in order to generate a unique login URL so that OAuth server can take over. By redirecting user to the generated URL, user can enter their credentials. Calling this endpoint is crucial since it generates mandatory parameters and cookies.',
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

  @Get('/oauth-callback')
  @Redirect()
  @ApiOperation({
    summary:
      'Callback endpoint for FusionAuth after user entered their credentials and logged in.',
    description:
      'this is the URL in our application to which the OAuth server will redirect the user to after they log in. This URL must be and is registered with the OAuth server as a authorized redirect url.',
  })
  @ApiOkResponse({
    description:
      'User will be redirected to the frontend application with the JWT tokens attached to it as cookies.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Bad request; oauthState must be a string, etc.',
  })
  @ApiUnauthorizedResponse({
    type: ErrorResponse,
    description:
      'Unauthorized request; something is not right about the request, it might be because of unmatched states in the cookies and query param.',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Internal server error',
  })
  async oauthCallback(
    @Res() response: Response,
    @Cookies() cookies: OauthCallbackCookie,
    @Query() queries: OauthCallbackQuery,
  ): Promise<HttpRedirectResponse> {
    const frontendUrl = await this.authService.oauthCallback({
      response,
      cookies,
      queries,
    });

    return {
      statusCode: 302,
      url: frontendUrl,
    };
  }
}
