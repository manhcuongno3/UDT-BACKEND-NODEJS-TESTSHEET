import { belongsTo, Entity, model, property } from '@loopback/repository';
import { v4 as uuidv4 } from 'uuid';
import { Product } from './product.model';
import { Cart } from './cart.model';
@model()
export class CartItem extends Entity {
  @property({
    type: 'string',
    id: true,
    default: uuidv4,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    type: 'string',
  })
  cartId?: string;

  @property({
    type: 'string',
  })
  productId?: string;

  constructor(data?: Partial<CartItem>) {
    super(data);
  }
}

export interface CartItemRelations {
  // describe navigational properties here
}

export type CartItemWithRelations = CartItem & CartItemRelations;
