import {
  IsEmail,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email!: string;

  @IsString()
  public name!: string;

  @IsString()
  @Length(6, 12)
  public password!: string;

  @IsString()
  @Matches(/[^\\s]+(.*?)\\.(jpg|png)$/)
  public avatarPath?: string;
}
