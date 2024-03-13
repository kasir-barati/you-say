import { Errors } from '@fusionauth/typescript-client';
import ClientResponse from '@fusionauth/typescript-client/build/src/ClientResponse';
import { DuplicateEmailError } from '../contracts/duplicate-email-error.contract';
import { FusionAuthError } from '../contracts/fusionauth-error.contract';

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

  fusionAuthError(error: ClientResponse<unknown>): never {
    throw new FusionAuthError(JSON.stringify(error.exception));
  }
}
