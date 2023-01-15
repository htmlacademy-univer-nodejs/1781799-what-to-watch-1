import { DocumentType } from '@typegoose/typegoose';
import { MovieEntity } from './movie.entity.js';
import { CreateMovieDto } from './dto/create-movie.dto.js';
import { UpdateMovieDto } from './dto/update-movie.dto.js';
import { TGenre } from '../../types/genre.type.js';

export interface MovieServiceInterface {
  create(dto: CreateMovieDto): Promise<DocumentType<MovieEntity>>;
  findById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  findAll(): Promise<DocumentType<MovieEntity>[]>;
  findPromo(): Promise<DocumentType<MovieEntity> | null>;
  findByGenre(genre: TGenre): Promise<DocumentType<MovieEntity>[]>;
  updateById(movieId: string, dto: UpdateMovieDto): Promise<DocumentType<MovieEntity> | null>;
  deleteById(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  incrementCommentsCount(movieId: string): Promise<DocumentType<MovieEntity> | null>;
  updateMovieRating(movieId: string, newRating: number): Promise<DocumentType<MovieEntity> | null>;
}
