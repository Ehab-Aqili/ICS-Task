import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

export function encodePassword(password: string): string {
  try {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  } catch (error) {
    console.error('encodePassword error', error);
    throw new HttpException('Invalid request', HttpStatus.BAD_REQUEST);
  }
}

export function matchPassword(
  password: string,
  hashedPassword: string,
): boolean {
  try {
    const isMatch = bcrypt.compareSync(password, hashedPassword);
    return isMatch;
  } catch (err) {
    console.error('matchPassword error', err);
    return false;
  }
}
