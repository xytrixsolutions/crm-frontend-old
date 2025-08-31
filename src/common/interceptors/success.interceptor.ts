/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SUCCESS_MESSAGE_KEY } from '../annotations/success-message.decorator';
import { Reflector } from '@nestjs/core';
import { SUCCESS_CODE_KEY } from '../annotations/success-code.decorator';

@Injectable()
export class SuccessInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    response.status(200);

    const handler = context.getHandler();
    const customMessage =
      this.reflector.get<string>(SUCCESS_MESSAGE_KEY, handler) || 'Success';
    const customCode =
      this.reflector.get<string>(SUCCESS_CODE_KEY, handler) || 200;

    return next.handle().pipe(
      map((data) => ({
        success: {
          code: customCode,
          data,
          message: customMessage,
        },
      })),
    );
  }
}
