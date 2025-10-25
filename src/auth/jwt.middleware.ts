import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService, JwtPayload } from '../user/user.service';
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

      let payload: JwtPayload;
      let isTokenExpired = false;

      try {
        payload = this.jwtService.verify(token, { secret });
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (error.name === 'TokenExpiredError') {
          isTokenExpired = true;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const decodedPayload = this.jwtService.decode(token);
          if (!decodedPayload || typeof decodedPayload === 'string') {
            throw new UnauthorizedException('Invalid token format');
          }
          payload = decodedPayload as JwtPayload;
        } else {
          throw new UnauthorizedException('Invalid token');
        }
      }

      const user = await this.userService.findOneById(payload.id);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!user.isActive) {
        throw new UnauthorizedException('User account is deactivated');
      }

      if (isTokenExpired) {
        if (payload.isRefreshToken) {
          return res.status(401).json({
            message: 'Session expired',
            statusCode: 401,
            error: 'Session Expired',
          });
        } else {
          throw new UnauthorizedException('Invalid token');
        }
      } else {
        if (payload.isRefreshToken) {
          const tokens = this.userService.generateTokens(user);

          return res.status(200).json({
            message: 'Token refreshed successfully',
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          });
        } else {
          req.user = user;
          next();
        }
      }
    } catch (error) {
      console.error('JwtMiddleware error', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}
