import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(BadRequestException)
export class BadRequestFilter
  implements RpcExceptionFilter<BadRequestException>
{
  catch(exception: BadRequestException, host: ArgumentsHost): Observable<any> {
    return throwError(() => new RpcException(exception.getResponse()));
  }
}
