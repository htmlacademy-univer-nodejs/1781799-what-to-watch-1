import {
  IsString,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  public name?: string;

  @IsString()
  @Matches(/[^\\s]+(.*?)\\.(jpg|png)$/)
  public avatarPath?: string;
}
