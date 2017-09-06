// @flow

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { Provider } from 'react-redux';
// import type { Match } from 'react-router-dom';
import Landing from './Landing';
import Header from './Header';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import store from './store';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #333;
`;

const FourOhFour = () => <h1>404</h1>;

const App = () => (
  <Provider store={store}>
    <Wrapper>
      <Header />
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/login" component={LoginForm} />
        <Route exact path="/signup" component={SignupForm} />
        <Route component={FourOhFour} />
      </Switch>
    </Wrapper>
  </Provider>
);

export default App;
