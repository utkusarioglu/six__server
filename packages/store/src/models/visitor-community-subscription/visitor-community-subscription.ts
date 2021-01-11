import postgres from '../../connectors/postgres';
import { Model } from '../model/model';
import { VisitorCommunitySubscriptionInsert } from './visitor-community-subscription.types';

export class VisitorCommunitySubscriptionStore extends Model<VisitorCommunitySubscriptionInsert> {
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
      t.uuid('id').primary().defaultTo(postgres.raw('uuid_generate_v4()'));
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
