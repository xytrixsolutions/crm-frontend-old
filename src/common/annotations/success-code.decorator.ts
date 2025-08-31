import { SetMetadata } from '@nestjs/common';

export const SUCCESS_CODE_KEY = 'success_code';

export const SuccessCode = (code: number) =>
  SetMetadata(SUCCESS_CODE_KEY, code);
