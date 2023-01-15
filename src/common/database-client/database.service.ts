import mongoose from 'mongoose';
import {
  inject,
  injectable
} from 'inversify';
import { Component } from '../../types/component.types.js';
import { LoggerInterface } from '../logger/logger.interface';
import { DatabaseInterface } from './database.interface';

@injectable()
export class DatabaseService implements DatabaseInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
  ) {
  }

  public async connect(uri: string): Promise<void> {
    this.logger.info('Try to connect to MongoDB');
    await mongoose.connect(uri);
    this.logger.info('Database connection established.');
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info('Database connection closed.');
  }
}
