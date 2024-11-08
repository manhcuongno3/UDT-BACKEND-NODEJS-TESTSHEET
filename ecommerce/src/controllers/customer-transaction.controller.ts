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
  ) { }

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
    return this.customerRepository.transactions(id).find(filter);
  }

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
    return this.customerRepository.transactions(id).create(transaction);
  }

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
    return this.customerRepository.transactions(id).patch(transaction, where);
  }

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
    return this.customerRepository.transactions(id).delete(where);
  }
}
