// @flow

import React, { Component } from 'react';
// import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, Input } from 'semantic-ui-react';
import { fetchUser } from './actionCreators';

class Header extends Component {
  componentDidMount() {
    this.props.getUser();
  }
  props: {
    user: User,
    getUser: Function
  };
  renderContent() {
    switch (this.props.user) {
      case null:
        return '';
      case false:
        return (
          <Menu.Menu position="right">
            <Menu.Item>
              <Input icon="search" placeholder="Search..." />
            </Menu.Item>
            <Menu.Item name="Login" as="a" href="/login" link />
            <Menu.Item name="Signup" as="a" href="/signup" link />
          </Menu.Menu>
        );
      default:
        return (
          <Menu.Menu position="right">
            <Menu.Item>
              <Input icon="search" placeholder="Search..." />
            </Menu.Item>
            <Menu.Item name="Logout" as="a" href="/api/logout" link />
          </Menu.Menu>
        );
    }
  }
  render() {
    return (
      <Menu secondary>
        <Menu.Item link>
          <Link to="/">VotingApp</Link>
        </Menu.Item>

        {this.renderContent()}
      </Menu>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });

const mapDispatchToProps = (dispatch: Function) => ({
  getUser() {
    dispatch(fetchUser());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
