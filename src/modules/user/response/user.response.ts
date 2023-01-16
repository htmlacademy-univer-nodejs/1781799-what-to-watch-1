import { Expose } from 'class-transformer';

export class UserResponse {
  @Expose()
  public name!: string;

  @Expose()
  public email!: string;

  @Expose()
  public avatarPath!: string;
}
