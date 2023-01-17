import {
  inject,
  injectable,
} from 'inversify';
import express, { Express } from 'express';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { ConfigInterface } from '../common/config/config.interface.js';
import { Component } from '../types/component.type.js';
import { getDatabaseURI } from '../utils/db.js';
import { DatabaseInterface } from '../common/database-client/database.interface.js';
import { ControllerInterface } from '../common/controller/controller.interface.js';
import { ExceptionFilterInterface } from '../common/errors/exception-filter.interface.js';
import { AuthenticateMiddleware } from '../common/middlewares/authenticate.middleware.js';

@injectable()
export class Application {
  private express: Express;

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private databaseClient: DatabaseInterface,
    @inject(Component.MovieController) private movieController: ControllerInterface,
    @inject(Component.UserController) private userController: ControllerInterface,
    @inject(Component.ExceptionFilterInterface) private exceptionFilter: ExceptionFilterInterface,
    @inject(Component.CommentController) private commentController: ControllerInterface,
  ) {
    this.express = express();
  }

  initRoutes() {
    this.express.use('/movies', this.movieController.router);
    this.express.use('/users', this.userController.router);
    this.express.use('/comments', this.commentController.router);
  }

  initMiddleware() {
    this.express.use(express.json());
    this.express.use(
      '/upload',
      express.static(this.config.get('UPLOAD_DIR'))
    );
    const authenticateMiddleware = new AuthenticateMiddleware(this.config.get('JWT_SECRET'));
    this.express.use(authenticateMiddleware.execute.bind(authenticateMiddleware));
  }

  initExceptionFilters() {
    this.express.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  public async init() {
    this.logger.info('App initialization...');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    const databaseURI = getDatabaseURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(databaseURI);

    this.initMiddleware();
    this.initRoutes();
    this.initExceptionFilters();
    const port = this.config.get('PORT');
    this.express.listen(port,
      () => this.logger.info(`Server started on localhost:${port}`));
  }
}
