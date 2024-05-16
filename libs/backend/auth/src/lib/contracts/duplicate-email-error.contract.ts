import { BadRequestError } from '@backend/common';

export class DuplicateEmailError extends BadRequestError {
  constructor(email: string) {
    super(`Email already exists: ${email}`);
  }
}
