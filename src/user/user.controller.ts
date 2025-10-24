import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from './entities/user.entity';
// import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Get()
  getProfile(@GetUser() user: User) {
    return {
      message: 'Profile retrieved successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        isDeleted: user.isDeleted,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  update(@Body() updateUserDto: UpdateUserDto, @GetUser() currentUser: User) {
    return this.userService.update(currentUser.id, updateUserDto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  remove(@GetUser() currentUser: User) {
    return this.userService.remove(currentUser.id);
  }
}
