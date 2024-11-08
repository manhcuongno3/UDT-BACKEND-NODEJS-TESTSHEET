import { belongsTo, Entity, hasMany, model, property } from '@loopback/repository';
import { v4 as uuidv4 } from 'uuid';
import { Customer } from './customer.model';
import {CartItem} from './cart-item.model';
import {Product} from './product.model';

@model()
export class Cart extends Entity {
  @property({
    type: 'string',
    id: true,
    default: uuidv4,
  })
  id?: string;

  @hasMany(() => Product, {through: {model: () => CartItem}})
  products: Product[];

  @property({
    type: 'string',
  })
  customerId?: string;

  constructor(data?: Partial<Cart>) {
    super(data);
  }
}

export interface CartRelations {
  // describe navigational properties here
}

export type CartWithRelations = Cart & CartRelations;
