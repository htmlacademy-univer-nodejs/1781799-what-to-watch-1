import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';
import {
  TGenre,
  GenreEnum,
} from '../../../types/genre.type.js';

export class CreateMovieDto {
  @Length(2, 100)
  public name!: string;

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
  @Min(0)
  public duration!: number;

  @IsMongoId()
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
