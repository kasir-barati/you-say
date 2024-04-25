import { FusionOAuthError } from '@backend/common';
import { Errors } from '@fusionauth/typescript-client';
import { Injectable } from '@nestjs/common';
import { DuplicateEmailError } from '../contracts/duplicate-email-error.contract';
import { FusionAuthOAuthError } from '../types/fusionauth.type';

@Injectable()
export class FusionAuthErrorSerializer {
  duplicateEmail(
    error: { exception?: Errors },
    email: string,
  ): void | never {
    if (
      error.exception?.fieldErrors?.['user.email']?.some(
        (e) => e.code === '[duplicate]user.email',
      )
    ) {
      throw new DuplicateEmailError(email);
    }
  }

  oauthError(oauthError: FusionAuthOAuthError): void | never {
    if (
      oauthError?.statusCode &&
      oauthError?.exception?.error_description
    ) {
      throw new FusionOAuthError(
        oauthError.exception.error_description,
        oauthError.statusCode,
      );
    }
  }

  unknownError(error: unknown): never {
    throw new FusionOAuthError(
      JSON.stringify(error?.['exception']),
      500,
    );
  }
}
