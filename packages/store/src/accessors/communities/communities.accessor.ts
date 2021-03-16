import type { uuid } from '../../@types/helpers.types';
import type {
  CommunityListOut,
  CommunitySingleOut,
  CommunityCreateOut,
  CommunityCreateIn,
} from 'six__server__ep-types';
import community from '../../models/community/community.model';
import ucs from '../../models/user-community-subscription/user-community-subscription.model';
import ucc from '../../models/user-community-creator/user-community-creator.model';
import postgres from '../../connectors/postgres';
import ERRORS from '../../errors';

export class CommunitiesAccess {
  list(userId: uuid): Promise<void | CommunityListOut> {
    return userId
      ? community.selectForCommunityFeedForUserId(userId)
      : community.selectForCommunityFeedForVisitor();
  }

  single(communitySlug: string): Promise<void | CommunitySingleOut> {
    return community.selectForCommunityDetails(communitySlug);
  }

  async create(
    { description, name, slug }: CommunityCreateIn,
    userId: uuid
  ): Promise<void | CommunityCreateOut> {
    try {
      const communityId = await postgres.transaction(async (transaction) => {
        const communityInsertRows = await community.insert(
          { description, name, slug },
          transaction
        );
        if (!communityInsertRows) {
          throw new Error(ERRORS.COMMUNITY_INSERT);
        }
        const communityId = communityInsertRows[0].id;

        const ucsRows = await ucs.insert({ userId, communityId }, transaction);
        if (!ucsRows) {
          throw new Error(ERRORS.UCS_INSERT);
        }

        const uccRows = await ucc.insert({ userId, communityId }, transaction);
        if (!uccRows) {
          throw new Error(ERRORS.UCC_INSERT);
        }

        return slug;
      });
      return this.single(slug);
    } catch (e) {
      console.error(e);
      return Promise.resolve();
    }
  }
}

export default new CommunitiesAccess();
