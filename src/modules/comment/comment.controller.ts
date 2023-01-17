import {
  Request,
  Response,
} from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { HttpError } from '../../common/errors/http-error.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDto } from '../../utils/dto.js';
import { MovieServiceInterface } from '../movie/movie-service.interface.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CommentResponse } from './response/comment.response.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';

export class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController.');
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateCommentDto),
      ],
    });
  }

  public async create(
    {
      body,
      user
    }: Request<object, object, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    if (!await this.movieService.findById(body.movieId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Movie with id ${body.movieId} not found.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create({...body, userId: user.id});
    await this.movieService.updateMovieRating(body.movieId, comment.rating);
    await this.movieService.incrementCommentsCount(body.movieId);
    this.created(res, fillDto(CommentResponse, comment));
  }
}
