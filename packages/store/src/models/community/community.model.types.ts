import type { CommunitySingleOut } from 'six__server__ep-types';
import type { CommunityUpPl } from 'six__server__pl-types';
import type { ColumnMapping } from '../../helpers/model/model.types';
import type {
  InsertPrepareIn,
  InsertPrepareOut,
} from '../../@types/insert-prepare';
import type { uuid } from '../../@types/helpers.types';

export type { CommunityUpPl };

export type SelectForCommunityFeedColumns = ColumnMapping<CommunitySingleOut>;

export type CommunityCreatePrepareIn = InsertPrepareIn<CommunityUpPl>;
export type CommunityCreatePrepareOut = InsertPrepareOut<CommunityUpPl>;

export type CommunityInsertOut = { id: uuid }[];
