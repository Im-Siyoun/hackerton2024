import {
  Body,
  Controller,
  Get,
  Injectable,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LoginDTO } from './types/login.dto';
import { ResponseDto } from 'src/types/response.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAccessGuard } from './guard/jwt-access.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Injectable()
@Controller('/auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authservice: AuthService) {}

  @Post('/login')
  @ApiOperation({
    summary: '로그인',
  })
  @ApiBody({
    type: LoginDTO,
  })
  @ApiResponse({
    type: ResponseDto<{ message: 'login_success'; access_token: string }>,
  })
  async login(@Res() response: Response, @Body() data: LoginDTO): Promise<any> {
    console.log(data);
    const access_token = await this.authservice.login(data);
    response.setHeader('authotization', 'Bearer ' + access_token);
    console.log(access_token);
    return response.json(
      ResponseDto.success('login_success', { access_token }),
    );
  }

  @Get('/login')
  @UseGuards(JwtAccessGuard)
  @ApiOperation({
    summary: '로그인 확인용 api',
  })
  @ApiBearerAuth('token')
  logincheck(@Req() req: any): ResponseDto<any> {
    if (req.user) {
      return ResponseDto.success('로그인 되어있습니다.', {
        user: req.user.name,
      });
    }
    return ResponseDto.success('로그인 되어있지 않습니다.');
  }
}
