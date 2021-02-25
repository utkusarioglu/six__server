import { Model } from '../model';
import mockKnex from 'mock-knex';
import knex from 'knex';
import { PipelineEssentials } from '../types/sql-pipeline.types';

export interface MockStoreModel {
  id: number;
  name: string;
  lastName: string;
  age: number;
}

export type MockStorePipeline = PipelineEssentials;

export type MockStoreInsert = Pick<MockStoreModel, 'name' | 'lastName' | 'age'>;

export const mockPostgres = knex({
  client: 'postgres',
});

mockKnex.mock(mockPostgres);

export const tracker = mockKnex.getTracker();

export class MockStore extends Model<MockStorePipeline> {
  async createTable() {
    return this._createTable((table) => {
      table.increments('id').primary();
      table.text('name');
      table.text('lastName');
      table.integer('age');
    });
  }

  /**
   * Wraps _blockInProduction so that it can be accessed by the test
   */
  blockInProductionWrapper() {
    return this._blockInProduction();
  }

  /**
   *
   * @param err Wraps error handler for testing purposes
   */
  errorHandlerWrapper(err: string) {
    this._errorHandler(err);
  }
}
