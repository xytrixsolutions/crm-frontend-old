import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorResponse } from '../responses/error-response';

export class CustomException extends HttpException {
  constructor(
    message: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
    data: any = null,
  ) {
    super(new ErrorResponse(message, statusCode, data), statusCode);
  }
}
