import { GenreEnum, TGenre } from '../../../types/genre.type.js';
import { IsArray, IsDateString, IsEnum, IsInt, IsMongoId, IsString, Length, Matches, Max, Min } from 'class-validator';

export class UpdateMovieDto {
  @Length(2, 100)
  public name?: string;

  @Length(20, 1024)
  public description?: string;

  @IsDateString()
  public postDate?: Date;

  @IsEnum(GenreEnum)
  public genre?: TGenre;

  @IsInt()
  public year?: number;

  @IsInt()
  @Min(0)
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
  @Min(0)
  public duration?: number;

  @IsMongoId()
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
