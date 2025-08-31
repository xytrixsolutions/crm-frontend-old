import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { registerAs } from '@nestjs/config';

dotenv.config({ path: `environments/.env.${process.env.NODE_ENV || 'local'}` });

const config = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
