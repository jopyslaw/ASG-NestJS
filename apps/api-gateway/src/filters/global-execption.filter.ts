import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalRpcExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    if (
      exception &&
      typeof exception === 'object' &&
      exception.message === 'Rpc Exception'
    ) {
      const errorData = exception.error || {};

      const status = errorData.statusCode || 500;
      const message =
        errorData.response.message || 'Unknown error from microservice';

      return response.status(status).json({ statusCode: status, message });
    }

    return response.status(500).json({
      statusCode: 500,
      message: 'Unexpected error occurred',
    });
  }
}
