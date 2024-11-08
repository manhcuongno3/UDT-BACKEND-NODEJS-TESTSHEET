import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgreDataSource} from '../datasources';
import {CustomerTransaction, CustomerTransactionRelations} from '../models';

export class CustomerTransactionRepository extends DefaultCrudRepository<
  CustomerTransaction,
  typeof CustomerTransaction.prototype.id,
  CustomerTransactionRelations
> {
  constructor(
    @inject('datasources.Postgre') dataSource: PostgreDataSource,
  ) {
    super(CustomerTransaction, dataSource);
  }
}
