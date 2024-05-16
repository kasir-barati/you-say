/**
 * Generic error which results in HTTP 404 when caught by a Nestjs controller.
 */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    super.name = NotFoundError.name;
  }
}
