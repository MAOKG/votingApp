// @flow

declare var module: {
  hot: {
    accept(path: string, callback: () => void): void
  }
};

declare type User = Object | boolean;

export type FormFeedback = {
  data: Array<> | Object
};

declare type ActionType = 'SET_USER';

declare type ActionT<A: ActionType, P> = {|
  type: A,
  payload: P
|};

export type Action = ActionT<'SET_USER', User>;
