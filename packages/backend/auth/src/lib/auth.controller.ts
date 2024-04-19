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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { MeResponse } from '@shared';
import { Response } from 'express';
import { LoginQueryDto } from './dtos/login-query.dto';
import { MeCookie } from './dtos/me-cookie.dto';
import { MeResponseDto } from './dtos/me-response.dto';
import { OauthCallbackCookie } from './dtos/oauth-callback-cookies.dto';
import { OauthCallbackQuery } from './dtos/oauth-callback-query.dto';
import { RegisterDto } from './dtos/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
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
      'Client needs to call this endpoint first in order to generate a unique login URL so that OAuth server can take over. By redirecting user to the generated URL, user can enter their credentials. Calling this endpoint is crucial since it generates mandatory parameters and cookies. [Learn more here](https://github.com/FusionAuth/fusionauth-javascript-sdk-express/tree/main?tab=readme-ov-file#get-applogin).',
  })
  @ApiOkResponse({
    description:
      'User will be redirected to the generated login URL.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Bad request; clientId is not string, etc.',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Internal server error',
  })
  async login(
    @Res() response: Response,
    @Query() queries: LoginQueryDto,
  ): Promise<HttpRedirectResponse> {
    const loginRedirectUrl = await this.authService.login(
      response,
      queries,
    );

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
      'This is the URL in our application to which the OAuth server will redirect the user to after they log in. This URL must be and is registered with the OAuth server as a authorized redirect url. [Learn more here](https://github.com/FusionAuth/fusionauth-javascript-sdk-express/tree/main?tab=readme-ov-file#get-appcallback)',
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

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Will returns the Claims about the authenticated End-User.',
    description:
      'This endpoint gonna return userinfo which we get from OAuth server, our react SDK for OAuth server calls this endpoint after successful login.',
  })
  @ApiOkResponse({
    type: MeResponseDto,
    description: 'User info',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Internal server error',
  })
  @ApiBadRequestResponse({
    type: ErrorResponse,
    description: 'Bad request',
  })
  async me(@Cookies() cookies: MeCookie): Promise<MeResponse> {
    const userInfo = await this.authService.me(cookies);

    return userInfo;
  }
}
