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
  Agency,
  Product,
} from '../models';
import {AgencyRepository} from '../repositories';
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';
import { inject } from '@loopback/core';
import { checkUserAccess } from '../helpers/access-control.helper';
@authenticate('jwt')
export class AgencyProductController {
  constructor(
    @repository(AgencyRepository) protected agencyRepository: AgencyRepository,
    @inject(AuthenticationBindings.CURRENT_USER) private currentUser: UserProfile,
  ) { }

  @get('/agencies/{id}/products', {
    responses: {
      '200': {
        description: 'Array of Agency has many Product',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Product)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Product>,
  ): Promise<Product[]> {
    checkUserAccess(this.currentUser, id);
    return this.agencyRepository.products(id).find(filter);
  }

  @post('/agencies/{id}/products', {
    responses: {
      '200': {
        description: 'Agency model instance',
        content: {'application/json': {schema: getModelSchemaRef(Product)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {
            title: 'NewProductInAgency',
            exclude: ['id'],
            optional: ['agencyId']
          }),
        },
      },
    }) product: Omit<Product, 'id'>,
  ): Promise<Product> {
    checkUserAccess(this.currentUser, id);
    return this.agencyRepository.products(id).create(product);
  }

  @patch('/agencies/{id}/products', {
    responses: {
      '200': {
        description: 'Agency.Product PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Product, {partial: true}),
        },
      },
    })
    product: Partial<Product>,
    @param.query.object('where', getWhereSchemaFor(Product)) where?: Where<Product>,
  ): Promise<Count> {
    checkUserAccess(this.currentUser, id);
    return this.agencyRepository.products(id).patch(product, where);
  }

  @del('/agencies/{id}/products', {
    responses: {
      '200': {
        description: 'Agency.Product DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Product)) where?: Where<Product>,
  ): Promise<Count> {
    checkUserAccess(this.currentUser, id);
    return this.agencyRepository.products(id).delete(where);
  }
}
