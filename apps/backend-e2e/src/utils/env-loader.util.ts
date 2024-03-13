import { config } from 'dotenv';
import { join } from 'path';

config({
  path: join(process.cwd(), '.env'),
});
