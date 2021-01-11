/**
 * Specifies the properties that need to come from the user to
 * create a new community
 */

export interface CommunityUserInsert {
  /**
   * id of the community
   * ! this is only here for building the thing and shall be taken off before
   * ! production
   * */
  id?: string;
  /** description text for the community */
  description_text: string;
  /** Community name */
  name: string;
}
