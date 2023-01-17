import {
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  public name?: string;

  @IsString()
  @IsOptional()
  @Matches(/[^\\s]+(.*?)\\.(jpg|png)$/)
  public avatarPath?: string;
}
