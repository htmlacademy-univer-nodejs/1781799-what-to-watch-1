import {
  inject,
  injectable
} from 'inversify';
import { MovieServiceInterface } from './movie-service.interface.js';
import { CreateMovieDto } from './dto/create-movie.dto.js';
import {
  DocumentType,
  types
} from '@typegoose/typegoose';
import { MovieEntity } from './movie.entity.js';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../../common/logger/logger.interface.js';
import { TGenre } from '../../types/genre.type.js';
import { UpdateMovieDto } from './dto/update-movie.dto.js';

@injectable()
export class MovieService implements MovieServiceInterface {
  private readonly limit: number = 50;
  constructor(
    @inject(Component.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(Component.MovieModel) private readonly movieModel: types.ModelType<MovieEntity>
  ) {
  }

  async create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>> {
    const movie = await this.movieModel.create(dto);
    this.logger.info(`Movie created: ${dto.name}`);

    return movie;
  }

  async findById(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    const movie = await this.movieModel.findById(movieId).exec();
    if (!movie) {
      this.logger.warn(`Movie ${movieId} not found`);
    }

    return this.movieModel.findById(movieId).populate(['userId']).exec();
  }

  async deleteById(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    const movie = await this.movieModel
      .findByIdAndDelete(movieId)
      .exec();

    this.logger.info(`Movie ${movieId} has been deleted`);
    return movie;
  }

  async findAll(): Promise<DocumentType<MovieEntity>[]> {
    return this.movieModel.aggregate([
      {
        $lookup: {
          from: 'comments',
          let: {movieId: '$_id'},
          pipeline: [
            {$match: {$expr: {$in: ['$$movieId', '$movies']}}},
            {$project: {_id: 1}}
          ],
          as: 'comments'
        },
      },
      {
        $addFields: {
          id: {$toString: '$_id'},
          commentsCount: {$size: '$comments'},
          rating: {$avg: '$comments.rating'}
        }
      },
      {$unset: 'comments'},
      {$limit: this.limit}
    ]);
  }

  async findByGenre(genre: TGenre): Promise<DocumentType<MovieEntity>[]> {
    const limit = this.limit;
    const movies = await this.movieModel
      .find({genre}, {}, {limit})
      .populate('userId');

    this.logger.info(`${movies.length} movies in the ${genre} genre were found`);

    return movies;
  }

  async findPromo(): Promise<DocumentType<MovieEntity> | null> {
    const promoMovie = await this.movieModel
      .findOne({isPromo: true})
      .populate('userId');

    if (!promoMovie) {
      this.logger.warn('Promo movie not found');
    }

    return promoMovie;
  }

  async incrementCommentsCount(movieId: string): Promise<DocumentType<MovieEntity> | null> {
    return this.movieModel.findByIdAndUpdate(movieId, {$inc: {commentsCount: 1}});
  }

  async updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null> {
    const newMovie = await this.movieModel
      .findByIdAndUpdate(movieId, dto)
      .populate('userId')
      .exec();
    if (newMovie) {
      this.logger.info(`The movie ${movieId} has been updated`);
    } else {
      this.logger.warn(`Failed to update movie ${movieId}`);
    }

    return newMovie;
  }

  async updateMovieRating(movieId: string, newRating: number): Promise<DocumentType<MovieEntity> | null> {
    const movie = await this.findById(movieId);
    const oldRating = movie?.rating ?? 0;
    const ratingsCount = movie?.commentsCount ?? 0;
    if (!movie) {
      this.logger.warn(`Movie ${movieId} not found`);
    }

    return await this.updateById(
      movieId,
      {
        rating: (newRating + oldRating * ratingsCount) / (ratingsCount + 1)
      });
  }
}
