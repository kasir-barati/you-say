import {
  Controller,
  Get,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { HealthCheckResponseDto } from './dtos/healthcheck-response.dto';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthcheck')
  @ApiOperation({
    summary: "This endpoint exposes app's health state.",
  })
  @ApiOkResponse({
    type: HealthCheckResponseDto,
    description: "Returns app's health status",
  })
  @ApiInternalServerErrorResponse({
    type: InternalServerErrorException,
    description: 'Internal server error',
  })
  healthcheck(): HealthCheckResponseDto {
    return this.appService.healthcheck();
  }
}
