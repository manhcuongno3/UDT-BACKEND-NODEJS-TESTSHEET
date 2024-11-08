import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory, HasOneRepositoryFactory} from '@loopback/repository';
import {PostgreDataSource} from '../datasources';
import {Customer, CustomerRelations, Transaction, CustomerTransaction, Cart} from '../models';
import {CustomerTransactionRepository} from './customer-transaction.repository';
import {TransactionRepository} from './transaction.repository';
import {CartRepository} from './cart.repository';

export class CustomerRepository extends DefaultCrudRepository<
  Customer,
  typeof Customer.prototype.id,
  CustomerRelations
> {

  public readonly transactions: HasManyThroughRepositoryFactory<Transaction, typeof Transaction.prototype.id,
          CustomerTransaction,
          typeof Customer.prototype.id
        >;

  public readonly cart: HasOneRepositoryFactory<Cart, typeof Customer.prototype.id>;

  constructor(
    @inject('datasources.Postgre') dataSource: PostgreDataSource, @repository.getter('CustomerTransactionRepository') protected customerTransactionRepositoryGetter: Getter<CustomerTransactionRepository>, @repository.getter('TransactionRepository') protected transactionRepositoryGetter: Getter<TransactionRepository>, @repository.getter('CartRepository') protected cartRepositoryGetter: Getter<CartRepository>,
  ) {
    super(Customer, dataSource);
    this.cart = this.createHasOneRepositoryFactoryFor('cart', cartRepositoryGetter);
    this.registerInclusionResolver('cart', this.cart.inclusionResolver);
    this.transactions = this.createHasManyThroughRepositoryFactoryFor('transactions', transactionRepositoryGetter, customerTransactionRepositoryGetter,);
    this.registerInclusionResolver('transactions', this.transactions.inclusionResolver);
  }
}
