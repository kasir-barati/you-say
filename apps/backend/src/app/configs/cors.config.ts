import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { registerAs } from '@nestjs/config';

const allowedOrigins = ['http://localhost:3000'];

export default registerAs(
  'corsConfigs',
  (): CorsOptions => ({
    credentials: true,
    origin(requestOrigin, callback) {
      if (requestOrigin && !allowedOrigins.includes(requestOrigin)) {
        callback(new Error('Not allowed by CORS'));
        return;
      }

      callback(null, true);
    },
  }),
);
