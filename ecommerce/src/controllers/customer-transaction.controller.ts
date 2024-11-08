import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {
  Customer,
  Transaction
} from '../models';
import {CustomerRepository} from '../repositories';

export class CustomerTransactionController {
  constructor(
    @repository(CustomerRepository) protected customerRepository: CustomerRepository,
    @inject(AuthenticationBindings.CURRENT_USER) private currentUser: UserProfile,
  ) { }

  @authenticate('jwt')
  @get('/customers/{id}/transactions', {
    responses: {
      '200': {
        description: 'Array of Customer has many Transaction through CustomerTransaction',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Transaction)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Transaction>,
  ): Promise<Transaction[]> {
    if (this.currentUser[securityId] !== id) {
      throw new Error('Access denied: You can only view your own transactions');
    }
    return this.customerRepository.transactions(id).find(filter);
  }

  @authenticate('jwt')
  @post('/customers/{id}/transactions', {
    responses: {
      '200': {
        description: 'create a Transaction model instance',
        content: {'application/json': {schema: getModelSchemaRef(Transaction)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {
            title: 'NewTransactionInCustomer',
            exclude: ['id'],
          }),
        },
      },
    }) transaction: Omit<Transaction, 'id'>,
  ): Promise<Transaction> {
    if (this.currentUser[securityId] !== id) {
      throw new Error('Access denied: You can only create transactions for yourself');
    }
    return this.customerRepository.transactions(id).create(transaction);
  }

  @authenticate('jwt')
  @patch('/customers/{id}/transactions', {
    responses: {
      '200': {
        description: 'Customer.Transaction PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {partial: true}),
        },
      },
    })
    transaction: Partial<Transaction>,
    @param.query.object('where', getWhereSchemaFor(Transaction)) where?: Where<Transaction>,
  ): Promise<Count> {
    if (this.currentUser[securityId] !== id) {
      throw new Error('Access denied: You can only update your own transactions');
    }
    return this.customerRepository.transactions(id).patch(transaction, where);
  }

  @authenticate('jwt')
  @del('/customers/{id}/transactions', {
    responses: {
      '200': {
        description: 'Customer.Transaction DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Transaction)) where?: Where<Transaction>,
  ): Promise<Count> {
    if (this.currentUser[securityId] !== id) {
      throw new Error('Access denied: You can only delete your own transactions');
    }
    return this.customerRepository.transactions(id).delete(where);
  }
}
