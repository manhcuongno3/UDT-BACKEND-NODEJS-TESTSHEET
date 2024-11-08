import { TokenService } from '@loopback/authentication';
import { inject, Provider } from '@loopback/core';
import { securityId, UserProfile } from '@loopback/security';
import { sign, verify } from 'jsonwebtoken';
import { HttpErrors } from '@loopback/rest';

export class MyTokenService implements TokenService {
  constructor(
    @inject('jwt.secret') private jwtSecret: string,
  ) { }

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile[securityId]) {
      throw new HttpErrors.InternalServerError('Invalid user profile');
    }
    
    const payload = {
      id: userProfile[securityId],
      email: userProfile.email,
      role: userProfile.role,
      [securityId]: userProfile[securityId],
    };
    return sign(payload, this.jwtSecret, { expiresIn: '1h' });
  }

  async verifyToken(token: string): Promise<UserProfile> {
    try {
      const decodedToken = verify(token, this.jwtSecret) as any;
      const userProfile: UserProfile = {
        [securityId]: decodedToken.id,
        id: decodedToken.id,
        email: decodedToken.email,
        role: decodedToken.role,
      };
      return userProfile;
    } catch (error) {
      throw new HttpErrors.Unauthorized('Invalid token');
    }
  }
}
