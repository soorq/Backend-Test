import { DataSource, type DataSourceOptions } from 'typeorm';
import { ENTITIES } from '@/core/domain/entities';
import 'dotenv/config';

const options = (): DataSourceOptions => {
  const url = process.env.DB_URL;
  if (!url) throw new Error('Is db url is invalid');
  return {
    type: 'postgres',
    url,
    logging: true,
    entities: ENTITIES,
    synchronize: true,
    migrations: [`${process.cwd()}/migrations/*.{ts,js}`],
    migrationsRun: true,
    migrationsTableName: 'migrations',
    cache: {
      type: 'redis',
      tableName: 'redis',
      duration: 60000,
      options: {
        host: '0.0.0.0',
        port: 6379,
      },
    },
  };
};

export const appDataSource = new DataSource(options());
