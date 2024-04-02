export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    super.name = BadRequestError.name;
  }
}
