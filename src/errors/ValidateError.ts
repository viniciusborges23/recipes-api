export enum ERROR_TYPES {
  INGREDIENTS_MISSING = 'Ingredients parameter is required. (e.g.: ?i=bananas)',
  MAX_INGREDIENTS_ALLOWED = 'Max ingredients allowed exceeded. Max: 3.',
}

class ValidateError extends Error {
  public status: number;

  constructor(message: string, status?: number) {
    super(message);

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);

    this.status = status || 400;
  }
}

export default ValidateError;
