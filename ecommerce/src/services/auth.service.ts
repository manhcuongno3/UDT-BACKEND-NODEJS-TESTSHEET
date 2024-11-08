import { TokenService } from '@loopback/authentication';
import { repository } from '@loopback/repository';
import { inject, injectable } from '@loopback/core';
import { AdminRepository, CustomerRepository, AgencyRepository } from '../repositories';
import { promisify } from 'util';
import * as bcrypt from 'bcryptjs';
import { UserProfile, securityId } from '@loopback/security';
import { UserType } from '../utils/constants';
import { TokenServiceBindings } from '@loopback/authentication-jwt';
import { HttpErrors } from '@loopback/rest';

@injectable()
export class AuthService {
  constructor(
    @repository(AdminRepository) private adminRepository: AdminRepository,
    @repository(CustomerRepository) private customerRepository: CustomerRepository,
    @repository(AgencyRepository) private agencyRepository: AgencyRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE) private tokenService: TokenService,
  ) {}

  async register(data: any, userType: UserType): Promise<any> {
    const hashedPassword = await this.hashPassword(data.password);
    switch (userType) {
      case UserType.ADMIN:
        return this.adminRepository.create({ ...data, password: hashedPassword });
      case UserType.CUSTOMER:
        return this.customerRepository.create({ ...data, password: hashedPassword });
      case UserType.AGENCY:
        return this.agencyRepository.create({ ...data, password: hashedPassword });
      default:
        throw new Error('Invalid user type');
    }
  }

  async login(email: string, password: string, userType: UserType): Promise<string> {
    const user = await this.findUserByEmail(email, userType);

    if (!user || !(await this.verifyPassword(password, user.password))) {
      throw new Error('Invalid email or password');
    }

    if (!user.id) {
      throw new Error('User ID is undefined');
    }

    return this.tokenService.generateToken(this.createUserProfile(user, userType));
  }

  private async findUserByEmail(email: string, userType: UserType): Promise<any> {
    switch (userType) {
      case UserType.ADMIN:
        return this.adminRepository.findOne({ where: { email } });
      case UserType.CUSTOMER:
        return this.customerRepository.findOne({ where: { email } });
      case UserType.AGENCY:
        return this.agencyRepository.findOne({ where: { email } });
      default:
        throw new Error('Invalid user type');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return await promisify(bcrypt.hash)(password, 10);
  }

  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }


  private createUserProfile(user: any, userType: UserType): UserProfile {
    if (!user || !user.id) {
      throw new Error('User is not defined or does not have an ID');
    }
    return {
      [securityId]: user.id.toString(),
      email: user.email,
      role: userType,
    };
  }

  async verifyCredentials(email: string, password: string, userType: UserType): Promise<any> {
    const user = await this.findUserByEmail(email, userType);

    if (!user) {
      throw new HttpErrors.Unauthorized('Invalid email');
    }

    const passwordMatched = await this.verifyPassword(password, user.password);
    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Invalid password');
    }

    return user;
  }
}
