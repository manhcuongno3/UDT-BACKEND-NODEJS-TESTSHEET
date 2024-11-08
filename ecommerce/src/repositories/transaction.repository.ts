import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {PostgreDataSource} from '../datasources';
import {Transaction, TransactionRelations, Product, TransactionItem, Billing} from '../models';
import {TransactionItemRepository} from './transaction-item.repository';
import {ProductRepository} from './product.repository';
import {BillingRepository} from './billing.repository';

export class TransactionRepository extends DefaultCrudRepository<
  Transaction,
  typeof Transaction.prototype.id,
  TransactionRelations
> {

  public readonly products: HasManyThroughRepositoryFactory<Product, typeof Product.prototype.id,
          TransactionItem,
          typeof Transaction.prototype.id
        >;

  public readonly billing: HasOneRepositoryFactory<Billing, typeof Transaction.prototype.id>;

  constructor(
    @inject('datasources.Postgre') dataSource: PostgreDataSource, @repository.getter('TransactionItemRepository') protected transactionItemRepositoryGetter: Getter<TransactionItemRepository>, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>, @repository.getter('BillingRepository') protected billingRepositoryGetter: Getter<BillingRepository>,
  ) {
    super(Transaction, dataSource);
    this.billing = this.createHasOneRepositoryFactoryFor('billing', billingRepositoryGetter);
    this.registerInclusionResolver('billing', this.billing.inclusionResolver);
    this.products = this.createHasManyThroughRepositoryFactoryFor('products', productRepositoryGetter, transactionItemRepositoryGetter,);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
