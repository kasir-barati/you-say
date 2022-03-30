import { Test, TestingModule } from '@nestjs/testing';
import { GoogleLibPhoneNumberService } from './google-lib-phone-number.service';

describe('GoogleLibPhoneNumberService', () => {
    let service: GoogleLibPhoneNumberService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GoogleLibPhoneNumberService],
        }).compile();

        service = module.get<GoogleLibPhoneNumberService>(
            GoogleLibPhoneNumberService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
