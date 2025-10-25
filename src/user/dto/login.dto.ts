import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'User name or email address',
    example: 'John Doe',
  })
  @IsNotEmpty({ message: 'Email or username is required' })
  @IsString({ message: 'Email or username must be a string' })
  @MinLength(3, {
    message: 'Email or username must be at least 3 characters long',
  })
  @MaxLength(100, {
    message: 'Email or username must not exceed 100 characters',
  })
  identifier: string;

  @ApiProperty({
    description: 'Your password',
    example: 'Example123',
  })
  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
