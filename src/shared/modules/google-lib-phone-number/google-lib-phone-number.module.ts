import { Module } from '@nestjs/common';

import { GoogleLibPhoneNumberService } from './google-lib-phone-number.service';

@Module({
    providers: [GoogleLibPhoneNumberService],
    exports: [GoogleLibPhoneNumberService],
})
export class GoogleLibPhoneNumberModule {}
