import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { registerAs } from '@nestjs/config';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
];

export default registerAs(
  'corsConfigs',
  (): CorsOptions => ({
    origin(origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
  }),
);
