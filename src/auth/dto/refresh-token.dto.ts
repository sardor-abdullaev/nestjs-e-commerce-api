import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyNWI2YTVjLTI2MWUtNDQ2Ny05NmFlLTExNjhkMDIxNjA5NCIsImlhdCI6MTc0NTk5NzU2MCwiZXhwIjoxNzQ2MDgzOTYwfQ.oUE2IQ_021xVRSU8XmY4QEGBC32NYF5PXl4KvPjztZM',
  })
  accessToken: string;
  @IsString()
  refreshToken: string;
}
