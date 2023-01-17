import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';
import {
  GenreEnum,
  TGenre,
} from '../../../types/genre.type.js';

export class CreateMovieDto {
  @IsString()
  @Length(2, 100)
  public name!: string;

  @IsString()
  @Length(20, 1024)
  public description!: string;

  @IsDateString()
  public postDate!: Date;

  @IsEnum(GenreEnum)
  public genre!: TGenre;

  @IsInt()
  public year!: number;

  @IsString()
  public previewPath!: string;

  @IsString()
  public videoPath!: string;

  @IsArray()
  public actors!: string[];

  @IsString()
  public director!: string;

  @IsInt()
  @Min(1)
  public duration!: number;

  public userId!: string;

  @IsString()
  @Matches(/(\S+(\.jpg)$)/)
  public posterPath!: string;

  @IsString()
  @Matches(/(\S+(\.jpg)$)/)
  public backgroundImagePath!: string;

  @IsString()
  public backgroundColor!: string;
}
