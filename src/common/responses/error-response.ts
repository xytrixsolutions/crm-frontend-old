export class ErrorResponse<T = any> {
  error: {
    code: number;
    message: string;
    data: T | null;
  };

  constructor(
    message = 'An error occurred',
    code = 500,
    data: T | null = null,
  ) {
    this.error = { code, message, data };
  }
}
