import { Cookies, ErrorResponseDto } from '@backend/common';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpRedirectResponse,
  InternalServerErrorException,
  Post,
  Query,
  Redirect,
  Res,
  UnauthorizedException,
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
import { LoginQueryDto } from '../dtos/login-query.dto';
import { LogoutQueryDto } from '../dtos/logout-query.dto';
import { MeCookieDto } from '../dtos/me-cookie.dto';
import { MeResponseDto } from '../dtos/me-response.dto';
import { OauthCallbackCookie } from '../dtos/oauth-callback-cookies.dto';
import { OauthCallbackQuery } from '../dtos/oauth-callback-query.dto';
import { RefreshCookieDto } from '../dtos/refresh-cookie.dto';
import { RegisterDto } from '../dtos/register.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
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
    type: ErrorResponseDto,
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
    type: ErrorResponseDto,
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
    type: ErrorResponseDto,
    description: 'Bad request; oauthState must be a string, etc.',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description:
      'Internal server error or something about the request is not right.',
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
    type: ErrorResponseDto,
    description: 'Bad request',
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedException,
    description:
      'Could not validate and verify the provided JWT token',
  })
  async me(@Cookies() cookies: MeCookieDto): Promise<MeResponse> {
    const userInfo = await this.authService.me(cookies);

    return userInfo;
  }

  @Get('logout')
  @Redirect()
  @ApiOperation({
    summary:
      'Log the User out of the OAuth server SSO session using a GET request',
    description:
      "By calling this endpoint user's OAuth cookies will be removed and they will be redirected to the specified URL in the query string.",
  })
  @ApiOkResponse({
    description: 'Redirect user to the logout page of OAuth server.',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Internal server error.',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Bad request.',
  })
  logout(
    @Res() response: Response,
    @Query() queries: LogoutQueryDto,
  ): HttpRedirectResponse {
    const logoutUrl = this.authService.logout(response, queries);

    return {
      url: logoutUrl,
      statusCode: 302,
    };
  }

  @Post('refresh')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Refresh Token Grant Request',
    description:
      "You will make a request to this endpoint to exchange the user's refresh token for an access token and replace existing cookies with the new ones.",
  })
  @ApiOkResponse({
    description:
      'Get new tokens from OAuth server and replace them with the existing ones',
  })
  @ApiBadRequestResponse({
    type: ErrorResponseDto,
    description: 'Refresh token is missing in request cookies.',
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Internal server error.',
  })
  async refresh(
    @Res() response: Response,
    @Cookies() cookies: RefreshCookieDto,
  ): Promise<void> {
    await this.authService.refresh(response, cookies);
  }
}
