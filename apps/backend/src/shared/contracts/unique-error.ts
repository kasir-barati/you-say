/**
 * Generic error which results in HTTP 409 when caught by a Nestjs controller.
 */
export class UniqueError extends Error {
  constructor(message: string) {
    super(message);
    super.name = UniqueError.name;
  }
}
