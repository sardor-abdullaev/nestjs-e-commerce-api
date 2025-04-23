import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from 'src/users/dto/user-credentials.dto';
import { User } from 'src/users/user.entity';
import { Response } from 'express';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() userCredentialsDto: UserCredentialsDto): Promise<User> {
    return this.authService.register(userCredentialsDto);
  }

  @Post('/login')
  async login(
    @Body() userCredentialsDto: UserCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { accessToken, refreshToken } =
      await this.authService.login(userCredentialsDto);
    res.cookie('jwt', accessToken);

    return { accessToken, refreshToken };
  }

  @Post('/refresh')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.refresh(refreshTokenDto);
    res.cookie('jwt', accessToken);
    return { accessToken };
  }
}
