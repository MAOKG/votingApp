// @flow

declare var module: {
  hot: {
    accept(path: string, callback: () => void): void
  }
};

declare type User = Object | boolean;

export type FormRes = {
  message?: String,
  user?: User
};

declare type ActionType = 'SET_USER';

declare type ActionT<A: ActionType, P> = {|
  type: A,
  payload: P
|};

export type Action = ActionT<'SET_USER', User>;
