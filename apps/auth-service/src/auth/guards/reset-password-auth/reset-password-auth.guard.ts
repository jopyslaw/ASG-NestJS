import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ResetPasswordAuthGuard extends AuthGuard('reset-password-jwt') {
  canActivate(context: ExecutionContext) {
    const ctx = context.switchToRpc().getData();

    const request = context.switchToHttp().getRequest();
    request.body = ctx;

    return super.canActivate(context);
  }
}
