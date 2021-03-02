import type { CommunityPipeline, CommunityEndpoint } from 'six__public-api';
import type { SelectColumns } from '../model/types/model.types';

export type { CommunityPipeline };

export type SelectForCommunityFeedColumns = SelectColumns<
  CommunityEndpoint['_single']['_v1']['_get']['_res']['Success']['body']
>;
