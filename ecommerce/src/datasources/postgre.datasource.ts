import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  name: 'Postgre',
  connector: 'postgresql',
  url: '',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_DATABASE || 'ecommerce' 
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
