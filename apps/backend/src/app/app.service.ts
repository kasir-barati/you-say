import { Injectable } from '@nestjs/common';
import { HealthCheckResponseDto } from './dtos/healthcheck-response.dto';

@Injectable()
export class AppService {
  healthcheck(): HealthCheckResponseDto {
    return { message: 'healthy' };
  }
}
