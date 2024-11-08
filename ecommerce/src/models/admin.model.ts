import { Entity, hasMany, model, property } from '@loopback/repository';
import { v4 as uuidv4 } from 'uuid';
import { Agency } from './agency.model';
@model()
export class Admin extends Entity {
  @property({
    type: 'string',
    id: true,
    default: uuidv4,
  })
  id?: string;

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
  })
  phoneNumber?: string;

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

  @hasMany(() => Agency)
  agencies: Agency[];

  constructor(data?: Partial<Admin>) {
    super(data);
  }
}

export interface AdminRelations {
  // describe navigational properties here
}

export type AdminWithRelations = Admin & AdminRelations;
