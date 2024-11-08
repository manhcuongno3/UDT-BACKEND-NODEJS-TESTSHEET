import {inject} from '@loopback/core';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {Credentials} from '../models';
import {AuthService} from '../services/auth.service';

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
      throw new HttpErrors.Unauthorized('Invalid email or password');
    }
  }
}
