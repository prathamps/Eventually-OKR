import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { ObjectiveNotFoundError } from './error/ObjectiveNotFoundError';

@Catch(ObjectiveNotFoundError)
export class ObjectivesFilter implements ExceptionFilter {
  catch(exception: ObjectiveNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
