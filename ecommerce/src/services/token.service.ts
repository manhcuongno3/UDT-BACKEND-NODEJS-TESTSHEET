import { TokenService } from '@loopback/authentication';
import { inject, Provider } from '@loopback/core';
import { securityId, UserProfile } from '@loopback/security';
import { sign, verify } from 'jsonwebtoken';

export class MyTokenService implements TokenService {
  constructor(
    @inject('jwt.secret') private jwtSecret: string,
  ) { }

  async generateToken(userProfile: UserProfile): Promise<string> {
    const payload = {
      [securityId]: userProfile[securityId],
      email: userProfile.email,
      role: userProfile.role,
    };
    return sign(payload, this.jwtSecret, { expiresIn: '1h' });
  }

  async verifyToken(token: string): Promise<UserProfile> {
    const decodedToken = verify(token, this.jwtSecret);
    return decodedToken as UserProfile;
  }
}
