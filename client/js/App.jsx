// @flow

import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import styled from 'styled-components';
import { Provider } from 'react-redux';
import type { Match } from 'react-router-dom';
import Landing from './Landing';
import Polls from './Polls';
import UserPolls from './UserPolls';
import Profile from './Profile';
import Details from './Details';
import store from './store';

const FourOhFour = () => <h1>404</h1>;

const App = () => (
  <Provider store={store}>
    <div>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/polls" component={Polls} />
        <Route path="/polls/:id" component={(props: { match: Match }) => <Details id={props.match.params.id} />} />
        <Route path="/user/polls" component={UserPolls} />
        <Route path="/user/profile" component={Profile} />
        <Route component={FourOhFour} />
      </Switch>
    </div>
  </Provider>
);

export default App;
