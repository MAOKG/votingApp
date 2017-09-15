// @flow

import React from 'react';
import { Route, Switch } from 'react-router-dom';
// import styled from 'styled-components';
import { Provider } from 'react-redux';
// import type { Match } from 'react-router-dom';
import Landing from './Landing';
import Header from './Header';
import store from './store';

const FourOhFour = () => <h1>404</h1>;

const App = () => (
  <Provider store={store}>
    <div>
      <Header />
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route component={FourOhFour} />
      </Switch>
    </div>
  </Provider>
);

export default App;
