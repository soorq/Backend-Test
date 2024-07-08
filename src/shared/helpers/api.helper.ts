import { HttpStatus, Type } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiResponseStatus = (
  status: HttpStatus,
  ...description: string[]
) => {
  return ApiResponse({
    status,
    description: description.join(' | '),
    schema: {
      type: 'object',
      properties: {
        statusCode: {
          type: 'number',
        },
        message: {
          type: 'string',
        },
        error: {
          type: 'string',
        },
      },
      example: {
        statusCode: status,
        message: description.join(' | '),
        error: 'Some error',
      },
    },
  });
};

export const ApiResponseModel = (
  status: HttpStatus,
  description: string,
  type: Type<unknown> | string,
) => {
  return ApiResponse({
    status,
    description,
    type,
  });
};
