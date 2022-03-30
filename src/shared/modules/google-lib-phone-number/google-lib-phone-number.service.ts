import { Injectable } from '@nestjs/common';
import {
    PhoneNumberFormat,
    PhoneNumberUtil,
} from 'google-libphonenumber';

@Injectable()
export class GoogleLibPhoneNumberService {
    private phoneNumberUtil: PhoneNumberUtil;

    constructor() {
        this.phoneNumberUtil = new PhoneNumberUtil();
    }

    localizePhoneNumber(phoneNumber: string, cca2: string) {
        return (
            this.phoneNumberUtil
                .format(
                    this.phoneNumberUtil.parse(phoneNumber, cca2),
                    PhoneNumberFormat.NATIONAL,
                )
                // Remove spaces, Because if the phoneNumber be +989109679196 the normalized will be 0910 967 9196
                .replace(/ /g, '')
        );
    }

    globalizePhoneNumber(phoneNumber: string, cca2: string) {
        return this.phoneNumberUtil.format(
            this.phoneNumberUtil.parse(phoneNumber, cca2),
            PhoneNumberFormat.E164,
        );
    }
}
