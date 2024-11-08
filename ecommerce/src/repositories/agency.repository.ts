import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {PostgreDataSource} from '../datasources';
import {Agency, AgencyRelations, Transaction, AgencyTransaction, Product} from '../models';
import {AgencyTransactionRepository} from './agency-transaction.repository';
import {TransactionRepository} from './transaction.repository';
import {ProductRepository} from './product.repository';

export class AgencyRepository extends DefaultCrudRepository<
  Agency,
  typeof Agency.prototype.id,
  AgencyRelations
> {

  public readonly transactions: HasManyThroughRepositoryFactory<Transaction, typeof Transaction.prototype.id,
          AgencyTransaction,
          typeof Agency.prototype.id
        >;

  public readonly products: HasManyRepositoryFactory<Product, typeof Agency.prototype.id>;

  constructor(
    @inject('datasources.Postgre') dataSource: PostgreDataSource, @repository.getter('AgencyTransactionRepository') protected agencyTransactionRepositoryGetter: Getter<AgencyTransactionRepository>, @repository.getter('TransactionRepository') protected transactionRepositoryGetter: Getter<TransactionRepository>, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Agency, dataSource);
    this.products = this.createHasManyRepositoryFactoryFor('products', productRepositoryGetter,);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
    this.transactions = this.createHasManyThroughRepositoryFactoryFor('transactions', transactionRepositoryGetter, agencyTransactionRepositoryGetter,);
    this.registerInclusionResolver('transactions', this.transactions.inclusionResolver);
  }
}
