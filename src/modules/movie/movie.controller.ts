import core from 'express-serve-static-core';
import { HttpError } from '../../common/errors/http-error.js';
import { CreateMovieDto } from './dto/create-movie.dto.js';
import { UpdateMovieDto } from './dto/update-movie.dto.js';
import { MovieResponse } from './response/movie.response.js';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDto } from '../../utils/dto.js';
import { MovieServiceInterface } from './movie-service.interface.js';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import { CommentServiceInterface } from '../comment/comment-service.interface.js';
import { MovieParamsType } from './movie-params.type.js';
import { CommentResponse } from '../comment/response/comment.response.js';
import { ValidateDtoMiddleware } from '../../common/middlewares/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../common/middlewares/document-exists.middleware.js';

@injectable()
export class MovieController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for MovieController.');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.showPromo});
    this.addRoute({
      path: '/create',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateMovieDto),
      ],
    });
    this.addRoute({
      path: '/:movieId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ],
    });
    this.addRoute({
      path: '/:movieId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new ValidateDtoMiddleware(UpdateMovieDto),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ],
    });
    this.addRoute({
      path: '/:movieId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ],
    });
    this.addRoute({
      path: '/:movieId/comments',
      method: HttpMethod.Get,
      handler: this.showComments,
      middlewares: [
        new ValidateObjectIdMiddleware('movieId'),
        new DocumentExistsMiddleware(this.movieService, 'Movie', 'movieId'),
      ],
    });
  }

  async index(
    _req: Request,
    res: Response
  ): Promise<void> {
    const movies = await this.movieService.findAll();
    const movieResponse = fillDto(MovieResponse, movies);
    this.ok(res, movieResponse);
  }

  async showPromo(
    _: Request,
    res: Response
  ): Promise<void> {
    const promoMovie = await this.movieService.findPromo();
    this.ok(res, fillDto(MovieResponse, promoMovie));
  }

  async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>,CreateMovieDto>,
    res: Response
  ): Promise<void> {
    const movie = await this.movieService.create(body);
    this.created(res, fillDto(MovieResponse, movie));
  }

  async show(
    {params}: Request<Record<string, string>>,
    res: Response
  ): Promise<void> {
    const movie = await this.movieService.findById(params.movieId);
    this.ok(res, fillDto(MovieResponse, movie));
  }

  async update(
    {
      params,
      body
    }: Request<Record<string, string>, Record<string, unknown>, UpdateMovieDto>,
    res: Response
  ): Promise<void> {
    const movie = await this.movieService.findById(params.movieId);

    if (!movie) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Movie with id ${params.movieId} not found.`, 'MovieController');
    }

    const updatedMovie = await this.movieService.updateById(params.movieId, body);
    this.ok(res, fillDto(MovieResponse, updatedMovie));
  }

  async delete(
    {params}: Request<Record<string, string>>,
    res: Response
  ): Promise<void> {
    const movie = await this.movieService.findById(params.movieId);

    if (!movie) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Movie with id ${params.movieId} not found.`, 'MovieController');
    }

    await this.movieService.deleteById(`${params.movieId}`);
    this.noContent(res, {message: 'Movie deleted'});
  }

  async showComments(
    {params}: Request<core.ParamsDictionary | MovieParamsType>,
    res: Response
  ): Promise<void> {
    const comments = await this.commentService.findById(params.movieId);
    this.ok(res, fillDto(CommentResponse, comments));
  }
}
