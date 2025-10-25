import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class ValidateOtpDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'OTP code (6 digits)',
    example: 123456,
    minimum: 100000,
    maximum: 999999,
  })
  @IsNumber({}, { message: 'OTP must be a number' })
  @Min(100000, { message: 'OTP must be 6 digits' })
  @Max(999999, { message: 'OTP must be 6 digits' })
  @IsNotEmpty({ message: 'OTP is required' })
  otp: number;
}
