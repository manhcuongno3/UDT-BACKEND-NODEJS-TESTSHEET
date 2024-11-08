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
import {
  Customer,
  Cart,
} from '../models';
import {CustomerRepository} from '../repositories';

export class CustomerCartController {
  constructor(
    @repository(CustomerRepository) protected customerRepository: CustomerRepository,
  ) { }

  @get('/customers/{id}/cart', {
    responses: {
      '200': {
        description: 'Customer has one Cart',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Cart),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Cart>,
  ): Promise<Cart> {
    return this.customerRepository.cart(id).get(filter);
  }

  @post('/customers/{id}/cart', {
    responses: {
      '200': {
        description: 'Customer model instance',
        content: {'application/json': {schema: getModelSchemaRef(Cart)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Customer.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cart, {
            title: 'NewCartInCustomer',
            exclude: ['id'],
            optional: ['customerId']
          }),
        },
      },
    }) cart: Omit<Cart, 'id'>,
  ): Promise<Cart> {
    return this.customerRepository.cart(id).create(cart);
  }

  @patch('/customers/{id}/cart', {
    responses: {
      '200': {
        description: 'Customer.Cart PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Cart, {partial: true}),
        },
      },
    })
    cart: Partial<Cart>,
    @param.query.object('where', getWhereSchemaFor(Cart)) where?: Where<Cart>,
  ): Promise<Count> {
    return this.customerRepository.cart(id).patch(cart, where);
  }

  @del('/customers/{id}/cart', {
    responses: {
      '200': {
        description: 'Customer.Cart DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Cart)) where?: Where<Cart>,
  ): Promise<Count> {
    return this.customerRepository.cart(id).delete(where);
  }
}
