import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'Postgre',
  connector: 'postgresql',
  url: '',
  host: 'localhost',
  port: 5432,
  user: 'admin',
  password: 'admin',
  database: 'ecommerce'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class PostgreDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'Postgre';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.Postgre', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
