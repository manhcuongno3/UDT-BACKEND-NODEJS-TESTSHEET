import { belongsTo, Entity, model, property } from '@loopback/repository';
import { v4 as uuidv4 } from 'uuid';
import { Customer } from './customer.model';
import { Transaction } from './transaction.model';
@model()
export class CustomerTransaction extends Entity {
  @property({
    type: 'string',
    id: true,
    default: uuidv4,
  })
  id?: string;

  @property({
    type: 'string',
  })
  customerId?: string;

  @property({
    type: 'string',
  })
  transactionId?: string;

  constructor(data?: Partial<CustomerTransaction>) {
    super(data);
  }
}

export interface CustomerTransactionRelations {
  // describe navigational properties here
}

export type CustomerTransactionWithRelations = CustomerTransaction & CustomerTransactionRelations;
