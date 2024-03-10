import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckResponseDto {
  @ApiProperty({
    type: String,
    example: 'healthy',
    description: "The state of the app's health",
  })
  message: 'healthy' | 'unhealthy';
}
