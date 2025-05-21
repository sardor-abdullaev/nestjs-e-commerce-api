import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

interface ClassConstructor {
  new(...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) { }
  intercept(context: ExecutionContext, handler: CallHandler<any>): Observable<any> {
    return handler.handle().pipe(map((data: any) =>
      plainToInstance(this.dto, data, {
        excludeExtraneousValues: true,
      }),
    ),);
  }
}