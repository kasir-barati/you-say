export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message);
    super.name = ForbiddenError.name;
  }
}
