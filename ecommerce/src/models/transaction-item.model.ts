import { Entity, model, property } from '@loopback/repository';
import { v4 as uuidv4 } from 'uuid';
@model()
export class TransactionItem extends Entity {
  @property({
    type: 'string',
    id: true,
    default: uuidv4,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  productId: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity?: number;

  @property({
    type: 'number',
    required: true,
  })
  unitPrice: number;

  constructor(data?: Partial<TransactionItem>) {
    super(data);
  }
}

export interface TransactionItemRelations {
  // describe navigational properties here
}

export type TransactionItemWithRelations = TransactionItem & TransactionItemRelations;
