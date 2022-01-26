import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { registerAs } from '@nestjs/config';

// allowedOrigins restrict requests from unusual source
const allowedOrigins = [
    'http://localhost:3000',
    'https://example.com',
    'https://landing.example.com',
    'http://localhost:8080',
    'https://admin.example.me',
    'https://admin.example.com',
    'https://other.example.com',
    'https://other.com',
    'https://sample.com',
    'null',
];

export default registerAs(
    'corsConfigs',
    (): CorsOptions => ({
        origin: function (origin, callback) {
            // allow requests with no origin
            // (like mobile apps or curl requests)
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg =
                    'The CORS policy for this site does not ' +
                    'allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
    }),
);
