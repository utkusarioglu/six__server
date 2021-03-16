import type { uuid } from '../../@types/helpers.types';
import type {
  CommunityListOut,
  CommunitySingleOut,
  CommunityCreateOut,
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

  create(body: any, userId: uuid): Promise<void | CommunityCreateOut> {
    // temp
    return Promise.resolve();
  }
}

export default new CommunitiesAccess();
