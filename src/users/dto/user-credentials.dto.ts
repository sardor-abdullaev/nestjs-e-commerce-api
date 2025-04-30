import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserCredentialsDto {
  @ApiProperty({ example: 'test' })
  @IsString()
  login: string;

  @ApiProperty({ example: 'test123' })
  @IsString()
  password: string;
}
