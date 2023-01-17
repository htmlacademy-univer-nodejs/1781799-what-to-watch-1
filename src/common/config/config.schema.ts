import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type ConfigSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  DB_NAME: string;
  UPLOAD_DIR: string;
}

export const configSchema = convict<ConfigSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  SALT: {
    doc: 'Salt for password hash',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_HOST: {
    doc: 'IP address of the database server (MongoDB)',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: '127.0.0.1'
  },
  DB_USER: {
    doc: '',
    format: String,
    env: 'DB_USER',
    default: 'admin'
  },
  DB_PASSWORD: {
    doc: '',
    format: String,
    env: 'DB_PASSWORD',
    default: 'test'
  },
  DB_PORT: {
    doc: '',
    format: Number,
    env: 'DB_PORT',
    default: 27017
  },
  DB_NAME: {
    doc: '',
    format: String,
    env: 'DB_NAME',
    default: 'what-to-watch-db'
  },
  UPLOAD_DIR: {
    doc: '',
    format: String,
    env: 'UPLOAD_DIR',
    default: 'upload_dir'
  },
});
