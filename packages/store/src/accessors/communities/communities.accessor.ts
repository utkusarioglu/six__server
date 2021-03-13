import type { uuid } from '../../@types/helpers.types';
import type {
  CommunityListOut,
  CommunitySingleOut,
} from 'six__server__ep-types';
import community from '../../models/community/community.model';

export class CommunitiesAccess {
  list(userId: uuid): Promise<void | CommunityListOut> {
    return userId
      ? community.selectForCommunityFeedForUserId(userId)
      : community.selectForCommunityFeedForVisitor();
  }

  single(communitySlug: string): Promise<void | CommunitySingleOut> {
    return community.selectForCommunityDetails(communitySlug);
  }
}

export default new CommunitiesAccess();
