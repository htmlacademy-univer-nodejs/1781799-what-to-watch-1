import { HttpError } from '../../common/errors/http-error.js';
import { CreateMovieDto } from './dto/create-movie.dto.js';
import { UpdateMovieDto } from './dto/update-movie.dto.js';
import { MovieResponse } from './response/movie.response.js';
import {
  Request,
  Response
} from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  inject,
  injectable
} from 'inversify';
import { Controller } from '../../common/controller/controller.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { Component } from '../../types/component.type.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { fillDto } from '../../utils/dto.js';
import { MovieServiceInterface } from './movie-service.interface.js';

@injectable()
export class MovieController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.MovieServiceInterface) private readonly movieService: MovieServiceInterface
  ) {
    super(logger);

    this.logger.info('Register routes for MovieController.');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.getAll});
    this.addRoute({path: '/promo', method: HttpMethod.Get, handler: this.getPromo});
    this.addRoute({path: '/create', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/:movieId', method: HttpMethod.Get, handler: this.getMovie});
    this.addRoute({path: '/:movieId', method: HttpMethod.Patch, handler: this.updateFilm});
    this.addRoute({path: '/:movieId', method: HttpMethod.Delete, handler: this.deleteFilm});
  }

  async getAll(_req: Request, res: Response): Promise<void> {
    const movies = await this.movieService.findAll();
    const movieResponse = fillDto(MovieResponse, movies);
    this.ok(res, movieResponse);
  }

  async getPromo(_: Request, res: Response): Promise<void> {
    const promoMovie = await this.movieService.findPromo();
    this.ok(res, fillDto(MovieResponse, promoMovie));
  }

  async create({body}: Request<Record<string, unknown>, Record<string, unknown>, CreateMovieDto>, res: Response): Promise<void> {
    const movie = await this.movieService.create(body);
    this.created(res, fillDto(MovieResponse, movie));
  }

  async getMovie({params}: Request<Record<string, string>>, res: Response): Promise<void> {
    const movie = await this.movieService.findById(params.movieId);
    this.ok(res, fillDto(MovieResponse, movie));
  }

  async updateFilm({
    params,
    body
  }: Request<Record<string, string>, Record<string, unknown>, UpdateMovieDto>, res: Response): Promise<void> {
    const movie = await this.movieService.findById(params.movieId);

    if (!movie) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Movie with id ${params.movieId} not found.`, 'MovieController');
    }

    const updatedMovie = await this.movieService.updateById(params.movieId, body);
    this.ok(res, fillDto(MovieResponse, updatedMovie));
  }

  async deleteFilm({params}: Request<Record<string, string>>, res: Response): Promise<void> {
    const movie = await this.movieService.findById(params.movieId);

    if (!movie) {
      throw new HttpError(StatusCodes.NOT_FOUND, `Movie with id ${params.movieId} not found.`, 'MovieController');
    }

    await this.movieService.deleteById(`${params.movieId}`);
    this.noContent(res, {message: 'Movie deleted'});
  }
}
