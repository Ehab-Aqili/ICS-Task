import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';

export interface ResponseFormat<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
  path: string;
}

interface ResponseData {
  message?: string;
  user?: unknown;
  [key: string]: unknown;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data: ResponseData) => {
        // Handle different response scenarios
        let message = 'Request successful';
        let responseData = data;

        if (data && typeof data === 'object') {
          // If data has a message property, use it
          if ('message' in data && typeof data.message === 'string') {
            message = data.message;

            // Keep the whole structured response (like login/register)
            responseData = data;
          }
        }

        return {
          success: true,
          statusCode: response.statusCode,
          message,
          data: responseData as T,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      }),
    );
  }
}
