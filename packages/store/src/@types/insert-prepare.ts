import { PipelineEssentials } from 'six__server__pl-types';

export type InsertPrepareOut<
  UpPl extends PipelineEssentials
> = UpPl['_insert']['OutT'] & Partial<UpPl['_db']['JoinsT']>;

export type InsertPrepareIn<
  UpPl extends PipelineEssentials
> = UpPl['_insert']['In'];
