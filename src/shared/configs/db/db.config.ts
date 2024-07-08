import { DataSource, type DataSourceOptions } from 'typeorm';
import { ENTITIES } from '@/core/domain/entities';
import 'dotenv/config';

const options = (): DataSourceOptions => {
  const url = process.env.DB_URL;
  const redisUrl = process.env.REDIS_URL;
  if (!url || !redisUrl) throw new Error('Is db or redis url is invalid');
  return {
    type: 'postgres',
    url,
    logging: false,
    entities: ENTITIES,
    migrations: [`${process.cwd()}/migrations/*.{ts,js}`],
    migrationsRun: true,
    migrationsTableName: 'migrations',
    cache: {
      type: 'redis',
      tableName: 'redis',
      duration: 60000,
      options: {
        url: redisUrl,
      },
    },
  };
};

export const appDataSource = new DataSource(options());
