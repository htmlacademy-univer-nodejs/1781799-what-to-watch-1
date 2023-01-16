import {
  Request,
  Response
} from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  inject,
  injectable
} from 'inversify';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { Controller } from '../../common/controller/controller.js';
import { HttpError } from '../../common/errors/http-error.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDto } from '../../utils/dto.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { UserResponse } from './response/user.response.js';
import { UserServiceInterface } from './user-service.interface.js';

@injectable()
export class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) private readonly configService: ConfigInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController.');

    this.addRoute({path: '/register', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/login', method: HttpMethod.Post, handler: this.login});
    this.addRoute({path: '/login', method: HttpMethod.Get, handler: this.get});
  }

  async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if (user) {
      throw new HttpError(StatusCodes.CONFLICT, `User with email ${body.email} exists.`, 'UserController');
    }

    const newUser = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDto(UserResponse, newUser));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async login({body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>, _res: Response): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, `User with email ${body.email} not found.`, 'UserController',);
    }

    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController',);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(_: Request<Record<string, unknown>, Record<string, unknown>, Record<string, string>>, _res: Response): Promise<void> {
    throw new HttpError(StatusCodes.NOT_IMPLEMENTED, 'Not implemented', 'UserController',);
  }
}
