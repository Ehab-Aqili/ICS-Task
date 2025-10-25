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
import { SendOtpDto } from './dto/send-otp.dto';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { LoginDto } from './dto/login.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from './entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({ type: CreateUserDto })
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User successfully updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({ type: UpdateUserDto })
  update(@Body() updateUserDto: UpdateUserDto, @GetUser() currentUser: User) {
    return this.userService.update(currentUser.id, updateUserDto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({ status: 200, description: 'User successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  remove(@GetUser() currentUser: User) {
    return this.userService.remove(currentUser.id);
  }

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send OTP to user email for account activation' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBody({ type: SendOtpDto })
  sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return this.userService.sendOtp(sendOtpDto);
  }

  @Post('validate-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Validate OTP and activate user account' })
  @ApiResponse({ status: 200, description: 'Account activated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiBody({ type: ValidateOtpDto })
  validateOtp(@Body() validateOtpDto: ValidateOtpDto) {
    return this.userService.validateOtp(validateOtpDto);
  }
}
