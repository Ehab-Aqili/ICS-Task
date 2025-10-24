import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';

interface AuthenticatedRequest extends Request {
  user?: User;
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('No token provided');
      }

      const token = authHeader.substring(7);
      const secret = this.configService.get<string>('JWT_SECRET');
      console.log('Auth header:', req.headers.authorization);
      console.log('Extracted token:', token);
      console.log('JWT_SECRET:', this.configService.get('JWT_SECRET'));

      console.log(1);
      console.log('token', secret);
      const payload: { id: string } = this.jwtService.verify(token, {
        secret,
      });

      console.log(2);

      const user = await this.userService.findOneById(payload.id);
      console.log(3);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('User account is deactivated');
      }

      // Attach user to request object for controllers to access
      req.user = user;

      next();
    } catch (error) {
      console.log('error', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
