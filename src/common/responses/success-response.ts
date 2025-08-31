export class SuccessResponse<T = any> {
  success: {
    code: number;
    data: T;
    message: string;
  };

  constructor(data: T, message = 'Success', code = 200) {
    this.success = { code, data, message };
  }
}
