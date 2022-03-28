import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { userEntity } from '../db/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext): userEntity => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
