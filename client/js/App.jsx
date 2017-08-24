// @flow

import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import type { Match } from 'react-router-dom';
import Landing from './Landing';

const FourOhFour = () => <h1>404</h1>;

const App = () =>
  <Switch>
    <Route exact path="/" component={Landing} />
    <Route component={FourOhFour} />
  </Switch>;

export default App;
