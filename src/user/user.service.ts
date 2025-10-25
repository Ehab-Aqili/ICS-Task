import {
  Injectable,
  ConflictException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { ValidateOtpDto } from './dto/validate-otp.dto';
import { User } from './entities/user.entity';
import { encodePassword, matchPassword } from './utils/HashPassword';
import { LoginDto } from './dto/login.dto';
import { EmailService } from './services/email.service';

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
  isRefreshToken?: boolean;
}

export interface LoginResponse {
  message: string;
  user: Partial<User>;
  accessToken: string;
  refreshToken?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ message: string; user: Partial<User> }> {
    try {
      const { name, email, password } = createUserDto;

      const existingUserByEmail = await this.userRepository.findOne({
        where: { email },
      });

      if (existingUserByEmail) {
        throw new ConflictException('User with this email already exists');
      }

      const existingUserByName = await this.userRepository.findOne({
        where: { name },
      });

      if (existingUserByName) {
        throw new ConflictException('User with this name already exists');
      }

      const hashedPassword = encodePassword(password);

      const newUser = this.userRepository.create({
        name,
        email,
        password: hashedPassword,
      });

      const savedUser = await this.userRepository.save(newUser);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = savedUser;

      return {
        message: 'User registered successfully',
        user: userWithoutPassword,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new HttpException(
        'Failed to register user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<{ message: string; users: Partial<User>[] }> {
    try {
      const users = await this.userRepository.find({
        where: { isDeleted: false },
        select: ['id', 'name', 'email', 'isActive', 'createdAt', 'updatedAt'],
      });

      return {
        message: 'Users retrieved successfully',
        users,
      };
    } catch (error) {
      console.error('Error retrieving users:', error);
      throw new HttpException(
        'Failed to retrieve users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<{ message: string; user: Partial<User> }> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id.toString(), isDeleted: false },
        select: ['id', 'name', 'email', 'isActive', 'createdAt', 'updatedAt'],
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return {
        message: 'User retrieved successfully',
        user,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to retrieve user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; user: Partial<User> }> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id.toString(), isDeleted: false },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (updateUserDto.name && updateUserDto.name === user.name) {
        throw new ConflictException('User with this name already exists');
      }

      if (updateUserDto.email && updateUserDto.email === user.email) {
        throw new ConflictException('User with this email already exists');
      }

      const updateData: Partial<User> = { ...updateUserDto };

      await this.userRepository.update({ id: id.toString() }, updateData);

      const updatedUser = await this.userRepository.findOne({
        where: { id: id.toString() },
        select: ['id', 'name', 'email', 'isActive', 'createdAt', 'updatedAt'],
      });

      return {
        message: 'User updated successfully',
        user: updatedUser!,
      };
    } catch (error) {
      if (
        error instanceof HttpException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new HttpException(
        'Failed to update user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: id.toString(), isDeleted: false },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      await this.userRepository.update(
        { id: id.toString() },
        { isDeleted: true },
      );

      return {
        message: 'User deleted successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Failed to delete user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  _generateAccessToken(user: User): string {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      isRefreshToken: false,
    };

    return this.jwtService.sign(payload, {
      expiresIn: '15m',
    });
  }

  _generateRefreshToken(user: User): string {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      isRefreshToken: true,
    };

    return this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
  }

  generateTokens(user: User): { accessToken: string; refreshToken: string } {
    return {
      accessToken: this._generateAccessToken(user),
      refreshToken: this._generateRefreshToken(user),
    };
  }

  verifyToken(token: string): JwtPayload {
    return this.jwtService.verify(token);
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    try {
      const { identifier, password } = loginDto;

      const user = await this.findByEmailOrUsername(identifier);

      if (!user) {
        throw new UnauthorizedException('Invalid email/username');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('Account is deactivated');
      }

      const isPasswordValid = matchPassword(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email/username');
      }

      const tokens = this.generateTokens(user);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...userWithoutPassword } = user;

      return {
        message: 'Login successful',
        user: userWithoutPassword,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new HttpException('Login failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id, isDeleted: false },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, isDeleted: false },
    });
  }

  async findByEmailOrUsername(identifier: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: [
        { email: identifier, isDeleted: false },
        { name: identifier, isDeleted: false },
      ],
    });
  }

  async sendOtp(sendOtpDto: SendOtpDto): Promise<{ message: string }> {
    try {
      const { email } = sendOtpDto;

      const user = await this.userRepository.findOne({
        where: { email, isDeleted: false },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.isActive) {
        throw new BadRequestException('Account is already active');
      }

      const otp = Math.floor(100000 + Math.random() * 900000);

      const otpExpiresAt = new Date();
      otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 1);

      await this.userRepository.update({ id: user.id }, { otp, otpExpiresAt });

      await this.emailService.sendOtpEmail(email, otp);

      return {
        message: 'OTP sent successfully to your email',
      };
    } catch (error) {
      if (
        error instanceof HttpException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new HttpException(
        'Failed to send OTP',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateOtp(
    validateOtpDto: ValidateOtpDto,
  ): Promise<{ message: string; user: Partial<User> }> {
    try {
      const { email, otp } = validateOtpDto;

      const user = await this.userRepository.findOne({
        where: { email, isDeleted: false },
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      if (user.isActive) {
        throw new BadRequestException('Account is already active');
      }

      if (!user.otp || !user.otpExpiresAt) {
        throw new BadRequestException('No OTP found. Please request a new OTP');
      }

      const now = new Date();
      if (now > user.otpExpiresAt) {
        await this.userRepository.update(
          { id: user.id },
          { otp: null, otpExpiresAt: null },
        );
        throw new BadRequestException(
          'OTP has expired. Please request a new OTP',
        );
      }

      if (user.otp !== otp) {
        throw new BadRequestException('Invalid OTP');
      }

      await this.userRepository.update(
        { id: user.id },
        {
          isActive: true,
          otp: null,
          otpExpiresAt: null,
        },
      );

      const updatedUser = await this.userRepository.findOne({
        where: { id: user.id },
        select: ['id', 'name', 'email', 'isActive', 'createdAt', 'updatedAt'],
      });

      return {
        message: 'Account activated successfully',
        user: updatedUser!,
      };
    } catch (error) {
      if (
        error instanceof HttpException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new HttpException(
        'Failed to validate OTP',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
