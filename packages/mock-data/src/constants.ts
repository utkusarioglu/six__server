import { CommunityUserInsert } from 'six__server__store/src/models/community/community.types';
import type { PostInsert } from 'six__server__store/src/models/post/post.types';
import type { UserCommunitySubscriptionInsert } from 'six__server__store/src/models/user-community-subscription/user-community-subscription.types';
import type { VisitorCommunitySubscriptionInsert } from 'six__server__store/src/models/visitor-community-subscription/visitor-community-subscription.types';
import type { UserInsert } from 'six__server__store/src/models/user/user.types';

export const USERS: UserInsert[] = [
  {
    id: 'fced7bf2-fa80-46fe-b83b-0cae45ca5db0',
    username: 'utkusarioglu',
    password: '$2b$10$7O1nkhhxET9jgLY3FvAWseEgM5qELRtqeqlef051y3r9FD/XTwUZC',
    email: 'utkusarioglu@gmail.com',
    age: 36,
  },
  {
    id: '6cfb8fe7-074e-4cd5-ba38-bf1cceaf0dd6',
    username: 'mr_bun',
    password: '$2b$10$7O1nkhhxET9jgLY3FvAWseEgM5qELRtqeqlef051y3r9FD/XTwUZC',
    email: 'mrbun@gmail.com',
    age: 22,
  },
  {
    id: '15ffc829-6767-4dbe-86bb-b7303cba06a5',
    username: 'john_doe',
    password: '$2b$10$7O1nkhhxET9jgLY3FvAWseEgM5qELRtqeqlef051y3r9FD/XTwUZC',
    email: 'john@doe.com',
    age: 56,
  },
];

export const COMMUNITIES: CommunityUserInsert[] = [
  {
    id: 'ac6acb36-a2c4-4c32-b9c3-22143e4d133d',
    name: 'Nuclear patients',
    description_text:
      'we are here to support the rights of patients that were thrown into nuclear power plants',
  },
  {
    id: '268944e3-55a3-4361-967c-c17f530a660b',
    name: 'rabbit community',
    description_text:
      'rabbits make the world tremble. They rule more than ducks',
  },
  {
    id: '1bf52c83-a131-4322-9968-31711049c925',
    name: 'duck community',
    description_text: 'we are all about ducks and ducks rule',
  },
];

export const POSTS: PostInsert[] = [
  {
    title: "utku's first post",
    body: 'This is the body of my first post',
    user_id: 'fced7bf2-fa80-46fe-b83b-0cae45ca5db0',
    community_id: 'ac6acb36-a2c4-4c32-b9c3-22143e4d133d',
  },
  {
    title: 'I like rabbits more than ducks',
    body: 'This is the body of my first post',
    user_id: 'fced7bf2-fa80-46fe-b83b-0cae45ca5db0',
    community_id: '268944e3-55a3-4361-967c-c17f530a660b',
  },
  {
    title: 'ducks are simply better than rabbits',
    body: 'This is the body of my first post',
    user_id: 'fced7bf2-fa80-46fe-b83b-0cae45ca5db0',
    community_id: '1bf52c83-a131-4322-9968-31711049c925',
  },

  {
    title: 'I recently became a nuclear patient',
    body: 'Help me understand whats going on please, this is so weird',
    user_id: '6cfb8fe7-074e-4cd5-ba38-bf1cceaf0dd6',
    community_id: 'ac6acb36-a2c4-4c32-b9c3-22143e4d133d',
  },
  {
    title: "I don't understand the fascination with rabbits",
    body:
      "I have been reading the posts here and I have to admit that I don't understand the fascination you guys have with rabbits",
    user_id: '6cfb8fe7-074e-4cd5-ba38-bf1cceaf0dd6',
    community_id: '268944e3-55a3-4361-967c-c17f530a660b',
  },
  {
    title: 'I feel like no one knows my name anymore',
    body:
      "I have been a patient for a long time. But I still get these confused looks when people say my name. And they always act like I'm a random person when I'm in hospitals",
    user_id: '15ffc829-6767-4dbe-86bb-b7303cba06a5',
    community_id: 'ac6acb36-a2c4-4c32-b9c3-22143e4d133d',
  },
];

export const VISITOR_COMMUNITIES: VisitorCommunitySubscriptionInsert[] = [
  {
    community_id: '268944e3-55a3-4361-967c-c17f530a660b',
  },
  {
    community_id: '1bf52c83-a131-4322-9968-31711049c925',
  },
];

export const USER_COMMUNITY_SUBSCRIPTIONS: UserCommunitySubscriptionInsert[] = [
  {
    user_id: USERS[0].id!,
    community_id: COMMUNITIES[0].id!,
  },
];
