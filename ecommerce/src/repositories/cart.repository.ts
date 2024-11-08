import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {PostgreDataSource} from '../datasources';
import {Cart, CartRelations, Product, CartItem} from '../models';
import {CartItemRepository} from './cart-item.repository';
import {ProductRepository} from './product.repository';

export class CartRepository extends DefaultCrudRepository<
  Cart,
  typeof Cart.prototype.id,
  CartRelations
> {

  public readonly products: HasManyThroughRepositoryFactory<Product, typeof Product.prototype.id,
          CartItem,
          typeof Cart.prototype.id
        >;

  constructor(
    @inject('datasources.Postgre') dataSource: PostgreDataSource, @repository.getter('CartItemRepository') protected cartItemRepositoryGetter: Getter<CartItemRepository>, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Cart, dataSource);
    this.products = this.createHasManyThroughRepositoryFactoryFor('products', productRepositoryGetter, cartItemRepositoryGetter,);
    this.registerInclusionResolver('products', this.products.inclusionResolver);
  }
}
