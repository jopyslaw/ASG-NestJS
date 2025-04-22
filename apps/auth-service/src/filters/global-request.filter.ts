import { Catch, ArgumentsHost, RpcExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class GlobalRpcExceptionFilter implements RpcExceptionFilter<any> {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    if (exception instanceof RpcException) {
      return throwError(() => exception);
    }

    const statusCode = exception.getStatus ? exception.getStatus() : 500;
    const response = exception.getResponse
      ? exception.getResponse()
      : { message: 'Internal server error' };

    return throwError(() => new RpcException({ statusCode, response }));
  }
}
