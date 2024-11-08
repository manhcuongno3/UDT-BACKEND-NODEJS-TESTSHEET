import {Entity, hasMany, model, property} from '@loopback/repository';
import {v4 as uuidv4} from 'uuid';
import {Gender} from '../utils/constants';
import {AgencyTransaction} from './agency-transaction.model';
import {Product} from './product.model';
import {Transaction} from './transaction.model';

@model()
export class Agency extends Entity {
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
      minLength: 3,
      errorMessage: 'Password phải có độ dài ít nhất 3 ký tự',
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
  })
  phoneNumber?: string;

  @property({
    type: 'string',
    required: true,
    enum: Object.values(Gender),
  })
  gender: Gender;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  createdAt?: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  updatedAt?: string;

  @hasMany(() => Transaction, {through: {model: () => AgencyTransaction}})
  transactions: Transaction[];

  @property({
    type: 'string',
  })
  adminId?: string;

  @hasMany(() => Product)
  products: Product[];

  constructor(data?: Partial<Agency>) {
    super(data);
  }
}

export interface AgencyRelations {
  // describe navigational properties here
}

export type AgencyWithRelations = Agency & AgencyRelations;
