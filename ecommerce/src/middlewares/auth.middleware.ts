import {
  AuthenticationBindings,
  AuthenticationMetadata,
  AuthenticationStrategy,
} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {MyTokenService} from '../services/token.service';

export class JWTAuthenticationStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public tokenService: MyTokenService,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    const token = this.extractCredentials(request);
    try {
      const userProfile: UserProfile = await this.tokenService.verifyToken(token);
      if (!userProfile[securityId]) {
        throw new HttpErrors.Unauthorized('Invalid user profile');
      }
      return userProfile;
    } catch (error) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }
  }

  extractCredentials(request: Request): string {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new HttpErrors.Unauthorized('Authorization header not found');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new HttpErrors.Unauthorized('Token not found');
    }

    return token;
  }
} 