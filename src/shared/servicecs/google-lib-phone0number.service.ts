import { Injectable } from '@nestjs/common';
import {
    PhoneNumberFormat,
    PhoneNumberUtil,
} from 'google-libphonenumber';

@Injectable()
export class GoogleLibPhoneNumber {
    private phoneNumberUtil: PhoneNumberUtil;

    constructor() {
        this.phoneNumberUtil = new PhoneNumberUtil();
    }

    normalizePhoneNumber(phoneNumber: string, cca2: string) {
        this.phoneNumberUtil.format(
            this.phoneNumberUtil.parse(phoneNumber, cca2),
            PhoneNumberFormat.E164,
        );
    }
}
