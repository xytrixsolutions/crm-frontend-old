/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ErrorResponse } from '../responses/error-response';
import { CustomException } from '../exceptions/custom-exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = null;
    let errorTitle = 'Internal Server Error';

    // Handle HttpExceptions (e.g. BadRequestException, NotFoundException)
    if (exception instanceof CustomException) {
      const exceptionResponse = exception.getResponse();
      status = exception.getStatus?.() ?? HttpStatus.BAD_REQUEST;
      errorTitle = (exceptionResponse as any).error.message || exception.name;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const responseBody =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || null;
      errorTitle = responseBody || (exceptionResponse as any).error;
    }

    // Handle DB constraint errors (e.g. duplicate key)
    else if (exception instanceof QueryFailedError) {
      const detail = (exception as any).driverError?.detail || '';
      const messageText = (exception as any).driverError?.message || '';

      // Constraint: duplicate key violation
      const duplicateMatch = detail.match(/\((.*?)\)=\((.*?)\)/);
      if (duplicateMatch) {
        const field = duplicateMatch[1];
        const value = duplicateMatch[2];
        const formattedField =
          field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ');
        errorTitle = `${formattedField} ${value} already exists.`;
        status = HttpStatus.CONFLICT;
      }

      // Constraint: null value violation
      else if (messageText.includes('violates not-null constraint')) {
        const fieldMatch = messageText.match(/null value in column "(.*?)"/);
        const field = fieldMatch?.[1] ?? 'field';
        const formattedField =
          field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ');
        errorTitle = `${formattedField} field is required.`;
        status = HttpStatus.BAD_REQUEST;
      }

      // Fallback for unknown DB errors
      else {
        errorTitle = 'Database Error';
        status = HttpStatus.INTERNAL_SERVER_ERROR;
      }
    }

    // Handle unexpected Errors
    else if (exception instanceof Error) {
      message = null;
      errorTitle = exception.message;
    }

    console.error('Exception caught by GlobalExceptionFilter:', exception);

    const errorResponse = new ErrorResponse(errorTitle, status, message);
    response.status(200).json(errorResponse);
  }
}
