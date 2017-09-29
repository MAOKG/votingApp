// @flow

import React from 'react';
// import { connect } from 'react-redux';
import { Menu, Container } from 'semantic-ui-react';

const Landing = () => (
  // let utilSpace;
  // if (props.user === null) {
  //   utilSpace = '';
  // } else if (props.user === false) {
  //   utilSpace = 'Please sign in to see votes';
  // } else {
  //   // $FlowFixMe
  //   const name = props.user.local ? props.user.local.firstName : props.user.google.name;
  //   utilSpace = `Welcome to Voting APP ${name}`;
  // }
  <Container>
    <Menu color="grey" inverted secondary stackable>
      <Menu.Item>HAHA</Menu.Item>
    </Menu>
  </Container>
);

// Landing.defaultProps = {
//   user: null
// };

// const mapStateToProps = state => ({ user: state.user });

export default Landing;
