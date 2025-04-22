import { IsString } from 'class-validator';

export class UserCredentialsDto {
  @IsString()
  login: string;

  @IsString()
  password: string;
}
