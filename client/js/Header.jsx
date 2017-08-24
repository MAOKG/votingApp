// @flow

import React, { Component } from 'react';
import axios from 'axios';
// import styled from 'styled-components';
import { Link } from 'react-router-dom';

class Header extends Component {
  state = {
    user: null
  };
  componentDidMount() {
    axios.get('/api/current_user').then(res => {
      // $FlowFixMe
      this.setState({ user: res.data ? res.data : false });
    });
  }
  renderContent() {
    switch (this.state.user) {
      case null:
        return '';
      case false:
        return (
          <h2>
            <a href="/auth/google">Login With Google</a>
          </h2>
        );
      default:
        return (
          <h2>
            <a href="/api/logout">Logout</a>
          </h2>
        );
    }
  }
  render() {
    return (
      <header>
        <h1>
          <Link to="/">VotingApp</Link>
        </h1>
        {this.renderContent()}
      </header>
    );
  }
}

export default Header;
