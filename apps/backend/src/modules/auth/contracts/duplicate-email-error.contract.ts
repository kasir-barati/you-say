import { BadRequestError } from '../../../shared/contracts/bad-request-error.contract';

export class DuplicateEmailError extends BadRequestError {
  constructor(email: string) {
    super(`Email already exists: ${email}`);
  }
}
