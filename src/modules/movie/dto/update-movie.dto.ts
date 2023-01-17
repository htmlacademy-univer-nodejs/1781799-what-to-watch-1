import {
  GenreEnum,
  TGenre,
} from '../../../types/genre.type.js';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt, IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class UpdateMovieDto {
  @IsString()
  @Length(2, 100)
  public name?: string;

  @IsString()
  @Length(20, 1024)
  public description?: string;

  @IsDateString()
  public postDate?: Date;

  @IsEnum(GenreEnum)
  public genre?: TGenre;

  @IsInt()
  public year?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(10)
  public rating?: number;

  @IsString()
  public previewPath?: string;

  @IsString()
  public videoPath?: string;

  @IsArray()
  public actors?: string[];

  @IsString()
  public director?: string;

  @IsInt()
  @Min(1)
  public duration?: number;

  public userId?: string;

  @IsString()
  @Matches(/(\S+(\.jpg)$)/)
  public posterPath?: string;

  @IsString()
  @Matches(/(\S+(\.jpg)$)/)
  public backgroundImagePath?: string;

  @IsString()
  public backgroundColor?: string;
}
