import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialsDto } from '../users/dto/user-credentials.dto';
import { User } from '../users/user.entity';
import { Request, Response } from 'express';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Tokens } from './dto/tokens.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 409, description: 'Login already exists' })
  @ApiResponse({ status: 201, type: User })
  register(@Body() userCredentialsDto: UserCredentialsDto): Promise<User> {
    return this.authService.register(userCredentialsDto);
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Authenticate user and return tokens' })
  @ApiResponse({
    status: 200,
    description:
      'Login successful. Tokens are returned and access token is set as cookie.',
    schema: {
      example: {
        accessToken: 'access-token-example',
        refreshToken: 'refresh-token-example',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() userCredentialsDto: UserCredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Tokens> {
    const { accessToken, refreshToken } =
      await this.authService.login(userCredentialsDto);
    res.cookie('jwt', accessToken, { httpOnly: true });

    return { accessToken, refreshToken };
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        accessToken: 'new-access-token',
      },
    },
  })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken } = await this.authService.refresh(refreshTokenDto);
    res.cookie('jwt', accessToken);
    return { accessToken };
  }

  @Post('/logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'User logged out successfully' };
  }

  @Get('/me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Current user info' })
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: Request) {
    return req.user;
  }
}
