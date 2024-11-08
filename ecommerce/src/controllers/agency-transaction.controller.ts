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
AgencyTransaction,
Transaction,
} from '../models';
import {AgencyRepository} from '../repositories';
import { inject } from '@loopback/core';
import { authenticate, AuthenticationBindings } from '@loopback/authentication';
import { UserProfile } from '@loopback/security';
import { checkUserAccess } from '../helpers/access-control.helper';

@authenticate('jwt')
export class AgencyTransactionController {
  constructor(
    @repository(AgencyRepository) protected agencyRepository: AgencyRepository,
    @inject(AuthenticationBindings.CURRENT_USER) private currentUser: UserProfile,
  ) { }

  @get('/agencies/{id}/transactions', {
    responses: {
      '200': {
        description: 'Array of Agency has many Transaction through AgencyTransaction',
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
    checkUserAccess(this.currentUser, id);
    return this.agencyRepository.transactions(id).find(filter);
  }

  @post('/agencies/{id}/transactions', {
    responses: {
      '200': {
        description: 'create a Transaction model instance',
        content: {'application/json': {schema: getModelSchemaRef(Transaction)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Transaction, {
            title: 'NewTransactionInAgency',
            exclude: ['id'],
          }),
        },
      },
    }) transaction: Omit<Transaction, 'id'>,
  ): Promise<Transaction> {
    checkUserAccess(this.currentUser, id);
    return this.agencyRepository.transactions(id).create(transaction);
  }

  @patch('/agencies/{id}/transactions', {
    responses: {
      '200': {
        description: 'Agency.Transaction PATCH success count',
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
    checkUserAccess(this.currentUser, id);
    return this.agencyRepository.transactions(id).patch(transaction, where);
  }

  @del('/agencies/{id}/transactions', {
    responses: {
      '200': {
        description: 'Agency.Transaction DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Transaction)) where?: Where<Transaction>,
  ): Promise<Count> {
    checkUserAccess(this.currentUser, id);
    return this.agencyRepository.transactions(id).delete(where);
  }
}
