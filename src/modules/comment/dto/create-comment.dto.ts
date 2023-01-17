import {
  IsMongoId,
  IsNumber,
  IsString,
  Length,
  Min,
  Max,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @Length(5, 1024)
  public text!: string;

  @IsNumber()
  @Min(0)
  @Max(10)
  public rating!: number;

  @IsMongoId()
  public movieId!: string;

  @IsMongoId()
  public userId!: string;
}
