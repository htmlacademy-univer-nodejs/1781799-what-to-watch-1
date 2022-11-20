import { TGenre } from '../../../types/genre.type.js';

export class CreateMovieDto {
  public name!: string;
  public description!: string;
  public postDate!: Date;
  public genre!: TGenre;
  public year!: number;
  public rating!: number;
  public previewPath!: string;
  public videoPath!: string;
  public actors!: string[];
  public director!: string;
  public duration!: number;
  public userId!: string;
  public posterPath!: string;
  public backgroundImagePath!: string;
  public backgroundColor!: string;
}
