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
  @IsOptional()
  @IsString()
  @Length(2, 100)
  public name?: string;

  @IsOptional()
  @IsString()
  @Length(20, 1024)
  public description?: string;

  @IsOptional()
  @IsDateString()
  public postDate?: Date;

  @IsOptional()
  @IsEnum(GenreEnum)
  public genre?: TGenre;

  @IsOptional()
  @IsInt()
  public year?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(10)
  public rating?: number;

  @IsOptional()
  @IsString()
  public previewPath?: string;

  @IsOptional()
  @IsString()
  public videoPath?: string;

  @IsOptional()
  @IsArray()
  public actors?: string[];

  @IsOptional()
  @IsString()
  public director?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  public duration?: number;

  @IsOptional()
  public userId?: string;

  @IsOptional()
  @IsString()
  @Matches(/(\S+(\.jpg)$)/)
  public posterPath?: string;

  @IsOptional()
  @IsString()
  @Matches(/(\S+(\.jpg)$)/)
  public backgroundImagePath?: string;

  @IsOptional()
  @IsString()
  public backgroundColor?: string;
}
