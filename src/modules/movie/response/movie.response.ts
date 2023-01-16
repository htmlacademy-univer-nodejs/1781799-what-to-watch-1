import { Expose } from 'class-transformer';
import { TGenre } from '../../../types/genre.type';

export class MovieResponse {
  @Expose()
  public name!: string;

  @Expose()
  public description!: string;

  @Expose()
  public postDate!: number;

  @Expose()
  public genre!: TGenre;

  @Expose()
  public year!: number;

  @Expose()
  public rating!: number;

  @Expose()
  public previewPath!: string;

  @Expose()
  public videoPath!: string;

  @Expose()
  public actors!: string[];

  @Expose()
  public director!: string;

  @Expose()
  public duration!: number;

  @Expose()
  public userId!: string;

  @Expose()
  public posterPath!: string;

  @Expose()
  public backgroundImagePath!: string;

  @Expose()
  public backgroundColor!: string;
}
