import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgreDataSource} from '../datasources';
import {AgencyTransaction, AgencyTransactionRelations} from '../models';

export class AgencyTransactionRepository extends DefaultCrudRepository<
  AgencyTransaction,
  typeof AgencyTransaction.prototype.id,
  AgencyTransactionRelations
> {
  constructor(
    @inject('datasources.Postgre') dataSource: PostgreDataSource,
  ) {
    super(AgencyTransaction, dataSource);
  }
}
