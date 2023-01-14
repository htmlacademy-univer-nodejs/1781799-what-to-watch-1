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

@injectable()
export class MovieService implements MovieServiceInterface {
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
    return this.movieModel.findById(movieId).exec();
  }
}
