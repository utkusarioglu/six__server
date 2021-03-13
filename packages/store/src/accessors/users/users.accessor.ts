import type {
  UserSignupIn,
  UserUcsAlterIn,
  UserUcsAlterOut,
  UserUcsIdListOut,
  UserUcsIdListInParams,
} from 'six__server__ep-types';
import user from '../../models/user/user.model';
import ucs from '../../models/user-community-subscription/user-community-subscription.model';
import postgres from '../../connectors/postgres';
import ERRORS from '../../errors';

export class UserAccess {
  session(email: string): Promise<false | Express.User> {
    return user.selectByEmail(email);
  }

  signup(input: UserSignupIn): Promise<void | Express.User> {
    return user.insert(input);
  }

  async getUcsIds(
    userId: UserUcsIdListInParams['userId']
  ): Promise<void | UserUcsIdListOut> {
    try {
      const ucsIdListRows = await ucs.getCommunityIdsForUserId(userId);
      if (!ucsIdListRows) {
        throw new Error(ERRORS.UCS_ID_LIST_RETRIEVE);
      }

      return ucsIdListRows.map((row) => row.communityId);
    } catch (e) {
      console.error(e);
      return Promise.resolve();
    }
  }

  alterUcs({
    userId,
    communityId,
    actionType,
  }: UserUcsAlterIn): Promise<void | UserUcsAlterOut> {
    try {
      return postgres.transaction(async (transaction) => {
        switch (actionType) {
          case 'subscribe':
            const existing = await ucs.selectForUserAndCommunity(
              userId,
              communityId
            );
            if (!existing) {
              const ucsInsertRows = await ucs.insert(
                { userId, communityId },
                transaction
              );
              if (!ucsInsertRows) {
                throw new Error(ERRORS.UCS_INSERT);
              }
            }

            return {
              userId,
              communityId,
              actionType,
            };

          case 'unsubscribe':
            await ucs.delete(userId, communityId);

            return {
              userId,
              communityId,
              actionType,
            };

          default:
            throw new Error(ERRORS.UCS_ALTER_ILLEGAL_ACTION_TYPE);
        }
      });
    } catch (e) {
      console.error(e);
      return Promise.resolve();
    }
  }
}

export default new UserAccess();
