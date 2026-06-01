import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { SignupDto } from './dto/signup.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const { isNew } = await this.usersService.createUser(signupDto.user_token);
    return {
      user_token: signupDto.user_token,
      new: isNew,
    };
  }
}
