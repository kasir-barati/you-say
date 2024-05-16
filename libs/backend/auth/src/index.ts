export { AuthModule } from './lib/auth.module';
export { AuthController } from './lib/controllers/auth.controller';
export { MobileAuthController } from './lib/controllers/mobile-auth.controller';

// #region For generating OpenAPI specification only
export { AuthService } from './lib/services/auth.service';
export { MobileAuthService } from './lib/services/mobile-auth.service';
// #endregion

export {
  AuthModuleOptions,
  AuthOptionsFactory,
} from './lib/types/auth.type';
