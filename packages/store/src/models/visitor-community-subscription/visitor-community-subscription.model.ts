import type { VisitorCommunitySubscriptionUpPl } from './visitor-community-subscription.model.types';
import postgres from '../../connectors/postgres';
import { Model } from '../../helpers/model/model';

export class VisitorCommunitySubscriptionStore extends Model<VisitorCommunitySubscriptionUpPl> {
  /**
   * Creates the respective table in the connected database.
   * Creation only happens if a table with the name {@link this.plural}
   * does not exist. This check does not take into account the structure
   * of the preexisting table
   *
   * @privateRemarks
   * Please be familiar with the workings of {@link Model._createTable}
   * Before using this method
   */
  async createTable() {
    return this._createTable((t) => {
      t.uuid('id').primary().defaultTo(this._raw('uuid_generate_v4()'));
      t.uuid('community_id').notNullable();

      t.foreign('community_id')
        .references('communities.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
  }
}

export default new VisitorCommunitySubscriptionStore({
  singular: 'visitor_community_subscription',
  plural: 'visitor_community_subscriptions',
  connector: postgres,
});
