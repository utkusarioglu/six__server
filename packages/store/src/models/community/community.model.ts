import type {
  CommunityUpPl,
  SelectForCommunityFeedColumns,
} from './community.model.types';
import postgres from '../../connectors/postgres';
import { Model } from '../../helpers/model/model';

export class CommunityStore extends Model<CommunityUpPl> {
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
    return this._createTable((table) => {
      table.uuid('id').primary().defaultTo(this._raw('uuid_generate_v4()'));
      table.timestamp('created_at').defaultTo(this._now());
      table.string('description');
      table.string('name');
      table.string('slug');
      table.integer('post_count').defaultTo(0);
      table.integer('subscriber_count').defaultTo(1);
    });
  }

  /**
   * Selects the communities list for the consumption of community feed
   */
  async selectForCommunityFeedForVisitor() {
    const columns: SelectForCommunityFeedColumns = {
      id: 'communities.id',
      createdAt: 'created_at',
      description: 'description',
      name: 'name',
      slug: 'slug',
      postCount: 'post_count',
      subscriberCount: 'subscriber_count',
      /**
       * Visitors cannot have subscriptions but as the same endpoint is used,
       * returning the same data shape makes things simpler. For this reason
       * visitors also return a static ucs = NULL property
       */
      ucs: this._raw('FALSE'),
    };

    return this._queryBuilder((table) =>
      table
        .select(columns)
        .leftJoin(
          { ucs: 'user_community_subscriptions' },
          'ucs.community_id',
          'communities.id'
        )
        .orderBy('communities.name')
    );
  }

  /**
   * Selects the communities list for the consumption of community feed
   */
  async selectForCommunityFeedForUserId(userId: string) {
    const columns: SelectForCommunityFeedColumns = {
      id: 'communities.id',
      createdAt: 'communities.created_at',
      description: 'communities.description',
      name: 'communities.name',
      slug: 'communities.slug',
      postCount: 'communities.post_count',
      subscriberCount: 'communities.subscriber_count',
      ucs: this._raw(
        `
        CASE 
          WHEN s.ucs_community_id IS NOT NULL 
          THEN TRUE 
          ELSE FALSE 
        END
        `
      ),
    };

    return this._queryBuilder((table) =>
      table
        .select(columns)
        .leftJoin(
          postgres
            .select({
              ucs_community_id: 'ucs.community_id',
            })
            .from({ ucs: 'user_community_subscriptions' })
            .leftJoin('users as u', 'u.id', 'ucs.user_id')
            .where({ 'u.id': userId })
            .as('s'),
          's.ucs_community_id',
          'communities.id'
        )
        .orderBy('communities.name')
    );
  }

  async selectForCommunityDetails(slug: string) {
    const columns: SelectForCommunityFeedColumns = {
      id: 'communities.id',
      createdAt: 'communities.created_at',
      description: 'communities.description',
      name: 'communities.name',
      slug: 'communities.slug',
      postCount: 'communities.post_count',
      subscriberCount: 'communities.subscriber_count',
      ucs: this._raw(
        `
        CASE 
          WHEN s.ucs_community_id IS NOT NULL 
          THEN TRUE 
          ELSE FALSE 
        END
        `
      ),
    };

    return this._queryBuilder((table) => {
      return table
        .first(columns)
        .leftJoin(
          { ucs: 'user_community_subscriptions' },
          'ucs.community_id',
          'communities.id'
        )
        .where({ slug });
    });
  }
}

export default new CommunityStore({
  singular: 'community',
  plural: 'communities',
  connector: postgres,
});
