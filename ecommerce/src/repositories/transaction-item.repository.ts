import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgreDataSource} from '../datasources';
import {TransactionItem, TransactionItemRelations} from '../models';

export class TransactionItemRepository extends DefaultCrudRepository<
  TransactionItem,
  typeof TransactionItem.prototype.id,
  TransactionItemRelations
> {
  constructor(
    @inject('datasources.Postgre') dataSource: PostgreDataSource,
  ) {
    super(TransactionItem, dataSource);
  }
}
