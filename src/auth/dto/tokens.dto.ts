import { ApiProperty } from '@nestjs/swagger';

export class Tokens {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyNWI2YTVjLTI2MWUtNDQ2Ny05NmFlLTExNjhkMDIxNjA5NCIsImlhdCI6MTc0NTk5NzU2MCwiZXhwIjoxNzQ2MDgzOTYwfQ.oUE2IQ_021xVRSU8XmY4QEGBC32NYF5PXl4KvPjztZM',
  })
  accessToken: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImMyNWI2YTVjLTI2MWUtNDQ2Ny05NmFlLTExNjhkMDIxNjA5NCIsImlhdCI6MTc0NTk5NzU2MCwiZXhwIjoxNzQ2NjAyMzYwfQ.Jy3l4fr4Tnxkh6bxAtF-n99ddRl3Mf4sDOv6JsP9XFw',
  })
  refreshToken: string;
}
