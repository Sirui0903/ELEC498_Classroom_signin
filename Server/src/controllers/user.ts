import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from '../services/user';
import { user } from '../interface/user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() userData: user) {
    return this.userService.createUser(userData);
  }
  @Post('login')
  login(@Body() userData: { user_name: string; password: string }) {
    return this.userService.login(userData);
  }

  @Get('getAllUser')
  getAllUser(@Query() data: { currentPage?: number; singleTotal?: number }) {
    return this.userService.getAllUser(data);
  }

  @Post('editUserClass')
  editUserClass(@Body() data: { uid: string; cid: string; oldCid?: string }) {
    return this.userService.editUserClass(data);
  }
}
