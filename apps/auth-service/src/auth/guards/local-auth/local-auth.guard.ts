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

    // Pobierz request i wstaw do niego dane ręcznie
    const request = context.switchToHttp().getRequest();
    request.body = ctx; // Przekazujemy payload do `req.body`, bo Passport tego wymaga

    return super.canActivate(context);
  }
}
