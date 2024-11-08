import { belongsTo, Entity, model, property } from '@loopback/repository';
import { v4 as uuidv4 } from 'uuid';
import { Agency } from './agency.model';
import { Transaction } from './transaction.model';
@model()
export class AgencyTransaction extends Entity {
  @property({
    type: 'string',
    id: true,
    default: uuidv4,
  })
  id?: string;

  @property({
    type: 'string',
  })
  agencyId?: string;

  @property({
    type: 'string',
  })
  transactionId?: string;

  constructor(data?: Partial<AgencyTransaction>) {
    super(data);
  }
}

export interface AgencyTransactionRelations {
  // describe navigational properties here
}

export type AgencyTransactionWithRelations = AgencyTransaction & AgencyTransactionRelations;
