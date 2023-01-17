import {
  Request,
  Response,
} from 'express';
import {
  inject,
  injectable,
} from 'inversify';
import { StatusCodes } from 'http-status-codes';
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
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';
import { UploadFileMiddleware } from '../../common/middlewares/upload-file.middleware.js';
import { LoggedUserResponse } from './response/logged-user.response.js';
import { createJwt } from '../../utils/jwt.js';

@injectable()
export class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.ConfigInterface) private readonly configService: ConfigInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController.');

    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateUserDto),
      ],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [
        new ValidateDtoMiddleware(LoginUserDto),
      ],
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Get,
      handler: this.get
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
        new DocumentExistsMiddleware(this.userService, 'User', 'userId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIR'), 'avatar'),
      ]
    });
  }

  async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateUserDto>,
    res: Response
  ): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if (user) {
      throw new HttpError(StatusCodes.CONFLICT, `User with email ${body.email} exists.`, 'UserController');
    }

    const newUser = await this.userService.create(body, this.configService.get('SALT'));
    this.created(res, fillDto(UserResponse, newUser));
  }

  async login(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
    res: Response
  ): Promise<void> {
    const user = await this.userService.verifyUser(body, this.configService.get('SALT'));
    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, `User with email ${body.email} not found or pass is invalid.`, 'UserController',);
    }

    const token = await createJwt(
      this.configService.get('JWT_SECRET'),
      { email: user.email, id: user.id}
    );

    this.ok(res, fillDto(LoggedUserResponse, {email: user.email, token}));
  }

  async get(
    body: Request<Record<string, unknown>, Record<string, unknown>, Record<string, string>>,
    res: Response
  ): Promise<void> {
    const user = await this.userService.findByEmail(body.user.email);
    this.ok(res, fillDto(LoggedUserResponse, user));
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
