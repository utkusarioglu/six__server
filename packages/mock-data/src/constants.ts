import { CommunityUpPl } from 'six__server__store/src/models/community/community.model.types';
import type { PostUpPl } from 'six__server__store/src/models/post/post.model.types';
import type { UserCommunitySubscriptionUpPl } from 'six__server__store/src/models/user-community-subscription/user-community-subscription.model.types';
import type { VisitorCommunitySubscriptionUpPl } from 'six__server__store/src/models/visitor-community-subscription/visitor-community-subscription.model.types';
import type { UserUpPl } from 'six__server__store/src/models/user/user.model.types';
import { UserContentUpPl } from 'six__server__pl-types';

export const USERS: (UserUpPl['_insert']['Out'] & {
  id: string;
})[] = [
  {
    id: 'fced7bf2-fa80-46fe-b83b-0cae45ca5db0',
    username: 'utkusarioglu',
    password: '$2b$10$xMLpIKE0xPvIHmj2tCSAUuAaUFV.Ra9rtL1XWsF.6Q3fIACf0P.KS', // Mb8rx-rt4k7
    email: 'utkusarioglu@gmail.com',
    age: 36,
  },
  {
    id: '6cfb8fe7-074e-4cd5-ba38-bf1cceaf0dd6',
    username: 'mr_bun',
    password: '$2b$10$xMLpIKE0xPvIHmj2tCSAUuAaUFV.Ra9rtL1XWsF.6Q3fIACf0P.KS', // Mb8rx-rt4k7
    email: 'mrbun@gmail.com',
    age: 22,
  },
  {
    id: '15ffc829-6767-4dbe-86bb-b7303cba06a5',
    username: 'john_doe',
    password: '$2b$10$xMLpIKE0xPvIHmj2tCSAUuAaUFV.Ra9rtL1XWsF.6Q3fIACf0P.KS', // Mb8rx-rt4k7
    email: 'john@doe.com',
    age: 56,
  },
];

export const COMMUNITIES: (CommunityUpPl['_insert']['Out'] & {
  id: string;
})[] = [
  {
    id: 'ac6acb36-a2c4-4c32-b9c3-22143e4d133d',
    name: 'NuclearPatients',
    slug: 'nuclear-patients',
    description:
      'we are here to support the rights of patients that were thrown into nuclear power plants',
  },
  {
    id: '268944e3-55a3-4361-967c-c17f530a660b',
    name: 'Rabbits',
    slug: 'rabbits',
    description: 'rabbits make the world tremble. They rule more than ducks',
  },
  {
    id: '1bf52c83-a131-4322-9968-31711049c925',
    name: 'Ducks',
    slug: 'ducks',
    description: 'we are all about ducks and ducks rule',
  },
];

export const POSTS: PostUpPl['_router']['In'][] = [
  {
    title: "utku's first post",
    body: 'This is the body of my first post',
    userId: 'fced7bf2-fa80-46fe-b83b-0cae45ca5db0',
    communityId: 'ac6acb36-a2c4-4c32-b9c3-22143e4d133d',
    mediaImagePath: '',
  },
  {
    title: 'I like rabbits more than ducks',
    body: `I have been thinking about this for a long time and at this point, I'm entirely sure that ducks suck and rabbits rule. Think about it. All that rabbits do is to advance the neo-con ideals and the domination of bees over the asia-pacific region. Thanks to you guys and all the awesome work we have done in this community, I see everything clearly now.`,
    userId: 'fced7bf2-fa80-46fe-b83b-0cae45ca5db0',
    communityId: '268944e3-55a3-4361-967c-c17f530a660b',
    mediaImagePath: '',
  },
  {
    title: 'ducks are simply better than rabbits',
    body: 'This is the body of my first post',
    userId: 'fced7bf2-fa80-46fe-b83b-0cae45ca5db0',
    communityId: '1bf52c83-a131-4322-9968-31711049c925',
    mediaImagePath: '',
  },

  {
    title: 'I recently became a nuclear patient',
    body: 'Help me understand whats going on please, this is so weird',
    userId: '6cfb8fe7-074e-4cd5-ba38-bf1cceaf0dd6',
    communityId: 'ac6acb36-a2c4-4c32-b9c3-22143e4d133d',
    mediaImagePath: '',
  },
  {
    title: "I don't understand the fascination with rabbits",
    body:
      "I have been reading the posts here and I have to admit that I don't understand the fascination you guys have with rabbits",
    userId: '6cfb8fe7-074e-4cd5-ba38-bf1cceaf0dd6',
    communityId: '268944e3-55a3-4361-967c-c17f530a660b',
    mediaImagePath: '1.jpg',
  },
  {
    title: 'I feel like no one knows my name anymore',
    body:
      "I have been a patient for a long time. But I still get these confused looks when people say my name. And they always act like I'm a random person when I'm in hospitals",
    userId: '15ffc829-6767-4dbe-86bb-b7303cba06a5',
    communityId: 'ac6acb36-a2c4-4c32-b9c3-22143e4d133d',
    mediaImagePath: '',
  },
];

export const VISITOR_COMMUNITIES: VisitorCommunitySubscriptionUpPl['_insert']['OutT'][] = [
  {
    community_id: '268944e3-55a3-4361-967c-c17f530a660b',
  },
  {
    community_id: '1bf52c83-a131-4322-9968-31711049c925',
  },
];

export const USER_COMMUNITY_SUBSCRIPTIONS: UserCommunitySubscriptionUpPl['_insert']['OutT'][] = [
  {
    user_id: USERS[0].id!,
    community_id: COMMUNITIES[0].id!,
  },
];

export const USER_CONTENTS: UserContentUpPl['_insert']['In'][] = [
  {
    filename: '1.jpg',
    type: 'image/jpg',
  },
];
