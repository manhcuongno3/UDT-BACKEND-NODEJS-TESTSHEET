import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {v4 as uuidv4} from 'uuid';
import {Gender} from '../utils/constants';
import {Cart} from './cart.model';
import {CustomerTransaction} from './customer-transaction.model';
import {Transaction} from './transaction.model';

@model()
export class Customer extends Entity {
  @property({
    type: 'string',
    id: true,
    default: uuidv4,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    unique: true,
    jsonSchema: {
      format: 'email',
      errorMessage: 'Email không hợp lệ',
    }
  })
  email: string;

  @property({
    type: 'string',
    required: true,
    hidden: true,
    jsonSchema: {
      minLength: 6,
      errorMessage: 'Password phải có độ dài ít nhất 6 ký tự',
    },
  })
  password: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      minLength: 3,
      maxLength: 200,
      errorMessage: 'Name phải có độ dài ít nhất 3 ký tự',
    }
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  address: string;

  @property({
    type: 'string',
    required: true,
  })
  phoneNumber: string;

  @property({
    type: 'string',
    required: true,
    enum: Object.values(Gender),
  })
  gender: Gender;

  @property({
    type: 'date',
    required: true,
    default: () => new Date(),
  })
  createdAt: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  updatedAt?: string;

  @hasMany(() => Transaction, {through: {model: () => CustomerTransaction}})
  transactions: Transaction[];

  @hasOne(() => Cart)
  cart: Cart;

  constructor(data?: Partial<Customer>) {
    super(data);
  }
}

export interface CustomerRelations {
  // describe navigational properties here
}

export type CustomerWithRelations = Customer & CustomerRelations;
