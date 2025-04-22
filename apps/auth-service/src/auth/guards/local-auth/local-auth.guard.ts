import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    const ctx = context.switchToRpc().getData();

    const request = context.switchToHttp().getRequest();
    request.body = ctx;

    return super.canActivate(context);
  }
}
