import type { VoteUpPl } from 'six__server__pl-types';
import type { PickSelectRows } from '../../helpers/model/model.types';
import type {
  InsertPrepareIn,
  InsertPrepareOut,
} from '../../@types/insert-prepare';

export type { VoteUpPl };

export type VoteInsertPrepareIn = InsertPrepareIn<VoteUpPl>;
export type VoteInsertPrepareOut = InsertPrepareOut<VoteUpPl>;

export type SelectPostVotesOut = PickSelectRows<
  VoteUpPl,
  'id' | 'vote_type',
  { id: 'voteId'; vote_type: 'voteType' }
>;

export type SelectPostVotesColumns = Record<keyof SelectPostVotesOut, string>;
