import {
  NextFunction,
  Request,
  Response,
} from 'express';
import {
  inject,
  injectable,
} from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { ExceptionFilterInterface } from './exception-filter.interface.js';
import { LoggerInterface } from '../logger/logger.interface.js';
import { HttpError } from './http-error.js';
import { Component } from '../../types/component.type.js';
import { createErrorObject } from '../../utils/error.js';

@injectable()
export class ExceptionFilter implements ExceptionFilterInterface {
  constructor(@inject(Component.LoggerInterface) private logger: LoggerInterface) {
    this.logger.info('Register ExceptionFilter');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleHttpError(error: HttpError, _req: Request, res: Response, _: NextFunction) {
    this.logger.error(`[${error.detail}]: ${error.httpStatusCode} — ${error.message}`);
    res.status(error.httpStatusCode).json(createErrorObject(error.message));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleOtherError(error: Error, _req: Request, res: Response, _: NextFunction) {
    this.logger.error(error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorObject(error.message));
  }

  public catch(error: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res, next);
    }

    this.handleOtherError(error, req, res, next);
  }
}
