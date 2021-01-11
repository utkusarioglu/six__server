/**
 * Defines the properties that need to be supplied by the user to insert a
 * UserCommunitySubscription entry
 */

export interface UserCommunitySubscriptionInsert {
  user_id: string;
  community_id: string;
}
