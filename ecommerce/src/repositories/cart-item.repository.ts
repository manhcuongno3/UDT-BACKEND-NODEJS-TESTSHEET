import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgreDataSource} from '../datasources';
import {CartItem, CartItemRelations} from '../models';

export class CartItemRepository extends DefaultCrudRepository<
  CartItem,
  typeof CartItem.prototype.id,
  CartItemRelations
> {
  constructor(
    @inject('datasources.Postgre') dataSource: PostgreDataSource,
  ) {
    super(CartItem, dataSource);
  }
}
