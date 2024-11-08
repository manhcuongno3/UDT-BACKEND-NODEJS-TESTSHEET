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
import { Agency } from '../models';
import { AgencyRepository } from '../repositories';
import { AuthService } from '../services';
import { inject } from '@loopback/core';
import { UserType } from '../utils/constants';
import { authenticate } from '@loopback/authentication';
import { sanitizeFilter } from '../decorators/sanitize-filter.decorator';

@authenticate('jwt')
export class AgencyController {
  constructor(
    @repository(AgencyRepository)
    public agencyRepository: AgencyRepository,
    @inject('services.AuthService')
    protected authService: AuthService,
  ) { }

  @authenticate.skip()
  @post('/agencies')
  @response(200, {
    description: 'Agency model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Agency) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agency, {
            title: 'NewAgency',
            exclude: ['id'],
          }),
        },
      },
    })
    agency: Omit<Agency, 'id'>,
  ): Promise<Agency> {
    return this.authService.register(agency,UserType.AGENCY);
  }

  @get('/agencies/count')
  @response(200, {
    description: 'Agency model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Agency) where?: Where<Agency>,
  ): Promise<Count> {
    return this.agencyRepository.count(where);
  }

  @authenticate.skip()
  @get('/agencies')
  @response(200, {
    description: 'Array of Agency model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Agency, { includeRelations: true }),
        },
      },
    },
  })
  @sanitizeFilter()
  async find(
    @param.filter(Agency) filter?: Filter<Agency>,
  ): Promise<Agency[]> {
    return this.agencyRepository.find(filter);
  }

  @patch('/agencies')
  @response(200, {
    description: 'Agency PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agency, { partial: true }),
        },
      },
    })
    agency: Agency,
    @param.where(Agency) where?: Where<Agency>,
  ): Promise<Count> {
    return this.agencyRepository.updateAll(agency, where);
  }

  @authenticate.skip()
  @get('/agencies/{id}')
  @response(200, {
    description: 'Agency model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Agency, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Agency, { exclude: 'where' }) filter?: FilterExcludingWhere<Agency>
  ): Promise<Agency> {
    return this.agencyRepository.findById(id, filter);
  }

  @patch('/agencies/{id}')
  @response(204, {
    description: 'Agency PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Agency, { partial: true }),
        },
      },
    })
    agency: Agency,
  ): Promise<void> {
    await this.agencyRepository.updateById(id, agency);
  }

  @put('/agencies/{id}')
  @response(204, {
    description: 'Agency PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() agency: Agency,
  ): Promise<void> {
    await this.agencyRepository.replaceById(id, agency);
  }

  @del('/agencies/{id}')
  @response(204, {
    description: 'Agency DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.agencyRepository.deleteById(id);
  }
}
