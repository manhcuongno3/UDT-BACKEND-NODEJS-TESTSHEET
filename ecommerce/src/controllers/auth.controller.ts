import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';
import { HttpErrors, post, requestBody } from '@loopback/rest';
import { authorize } from '../decorators/authorize.decorator';
import { Credentials } from '../models';
import { AuthService } from '../services/auth.service';
import { UserType } from '../utils/constants';

export class AuthController {
  constructor(
    @inject('services.AuthService')
    protected authService: AuthService
  ) { }

  @post('/login')
  async login(@requestBody() credentials: Credentials): Promise<{token: string}> {
    try {
      const token = await this.authService.login(
        credentials.email,
        credentials.password,
        credentials.userType
      );

      return {token};
    } catch (error) {
      if (error instanceof HttpErrors.Unauthorized) {
        throw error;
      }
      throw new HttpErrors.InternalServerError('Error while logging in');
    }
  }
}