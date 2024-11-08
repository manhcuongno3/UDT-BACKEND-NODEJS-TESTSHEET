import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import { Customer } from '../models';
import { CustomerRepository } from '../repositories';
import { AuthService } from '../services';
import { inject } from '@loopback/core';
import { UserType } from '../utils/constants';
import { authenticate } from '@loopback/authentication';
import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
import { HttpErrors } from '@loopback/rest';
import { sanitizeFilter } from '../decorators/sanitize-filter.decorator';


@authenticate('jwt')
export class CustomerController {
  constructor(
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository,
    @inject('services.AuthService')
    protected authService: AuthService,
  ) { }

  @authenticate.skip()
  @post('/customers')
  @response(200, {
    description: 'Customer model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Customer) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, {
            title: 'NewCustomer',
            exclude: ['id'],
          }),
        },
      },
    })
    customer: Omit<Customer, 'id'>,
  ): Promise<Customer> {
    return this.authService.register(customer, UserType.CUSTOMER);
  }

  @get('/customers/profile')
  @response(200, {
    description: 'Customer profile',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Customer, { includeRelations: true }),
      },
    },
  })
  async getProfile(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<Customer> {
    const userId = currentUserProfile[securityId];
    if (!userId) {
      throw new HttpErrors.Unauthorized('Invalid user profile');
    }
    const customer = await this.customerRepository.findById(userId);
    if (!customer) {
      throw new HttpErrors.NotFound('Customer not found');
    }
    return customer;
  }

  @patch('/customers/profile')
  @response(204, {
    description: 'Customer PATCH success',
  })
  async updateProfile(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Customer, { partial: true }),
        },
      },
    })
    customer: Partial<Customer>,
  ): Promise<void> {
    const userId = currentUserProfile[securityId];
    if (!userId) {
      throw new HttpErrors.Unauthorized('Invalid user profile');
    }
    await this.customerRepository.updateById(userId, customer);
  }

  @get('/customers')
  @response(200, {
    description: 'Array of Customer model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Customer, {includeRelations: true}),
        },
      },
    },
  })
  @sanitizeFilter()   
  async find(
    @param.filter(Customer) filter?: Filter<Customer>,
  ): Promise<Customer[]> {
    return this.customerRepository.find(filter);
  }

  @get('/customers/count')
  @response(200, {
    description: 'Customer model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Customer) where?: Where<Customer>,
  ): Promise<Count> {
    return this.customerRepository.count(where);
  }
}
