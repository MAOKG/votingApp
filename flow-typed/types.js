// @flow

export type AbstractPoll = {
  _id: string,
  title: string,
  author: { name: string, id: string },
  postDate: Date,
  voteNum: number
};

export type Poll = {
  _id: string,
  title: string,
  author: { name: string, id: string },
  postDate: Date,
  options: Array<Object>,
  peopleVoted: Array<Object>,
  voteNum: number
};

export type Polls = {
  polls?: Array<AbstractPoll>,
  error?: string
};

export type PollDetail = {
  hasVoted: boolean,
  isOwner: boolean,
  poll: Poll,
  error?: string
};

declare var module: {
  hot: {
    accept(path: string, callback: () => void): void
  }
};

declare type User = {
  _id: string,
  local?: {
    email: String,
    password: String,
    firstName: String,
    lastName: String
  },
  google?: {
    id: String,
    name: String
  }
};

export type UserFormRes = {
  message?: string,
  user?: User
};

export type PollFormRes = {
  error?: string,
  poll?: Poll
};

declare type ActionType =
  | 'SET_USER'
  | 'SET_ALL_POLLS'
  | 'ADD_POLL_DETAIL'
  | 'SET_LOGIN_MODAL'
  | 'SET_SIGNUP_MODAL'
  | 'SET_ADD_POLL_MODAL'
  | 'SET_SEARCH_TERM';

declare type ActionT<A: ActionType, P> = {|
  type: A,
  payload: P
|};

export type Action =
  | ActionT<'SET_USER', User>
  | ActionT<'SET_ALL_POLLS', Polls>
  | ActionT<'ADD_POLL_DETAIL', PollDetail>
  | ActionT<'SET_LOGIN_MODAL', boolean>
  | ActionT<'SET_SIGNUP_MODAL', boolean>
  | ActionT<'SET_ADD_POLL_MODAL', boolean>
  | ActionT<'SET_SEARCH_TERM', string>;
