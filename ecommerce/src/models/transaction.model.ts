import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {v4 as uuidv4} from 'uuid';
import {Billing} from './billing.model';
import {Product} from './product.model';
import {TransactionItem} from './transaction-item.model';

@model()
export class Transaction extends Entity {
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
  status?: string

  @property({
    type: 'date',
  })
  createdAt?: string;

  @property({
    type: 'number',
    required: true,
  })
  totalAmount: number;

  @hasMany(() => Product, {through: {model: () => TransactionItem, keyFrom: 'id', keyTo: 'productId'}})
  products: Product[];

  @hasOne(() => Billing)
  billing: Billing;

  constructor(data?: Partial<Transaction>) {
    super(data);
  }
}

export interface TransactionRelations {
  // describe navigational properties here
}

export type TransactionWithRelations = Transaction & TransactionRelations;
