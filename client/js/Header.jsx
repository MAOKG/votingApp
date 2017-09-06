// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUser } from './actionCreators';

const Head = styled.header`
  z-index: 10;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  background-color: #fafafa;
  padding: 8px 30px;
`;

const Home = styled.h1`
  font-family: Skia;
  font-weight: normal;
  color: #b10dc9;
  margin: 0;
`;

const HomeLink = styled(Link)`
  color: #b10dc9;
  text-decoration: none;
`;

const NavItem = styled.h2`
  font-weight: normal;
  margin: 0;
  display: inline;
`;

const NavItemLink = styled.a`
  color: #aaa;
  text-decoration: none;
  margin-right: 60px;
`;

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
          <div>
            <NavItem>
              <NavItemLink href="/login">Login</NavItemLink>
            </NavItem>
            <NavItem>
              <NavItemLink href="/signup">Signup</NavItemLink>
            </NavItem>
          </div>
        );
      default:
        return (
          <NavItem>
            <NavItemLink href="/api/logout">Logout</NavItemLink>
          </NavItem>
        );
    }
  }
  render() {
    return (
      <Head>
        <Home>
          <HomeLink to="/">VotingApp</HomeLink>
        </Home>
        {this.renderContent()}
      </Head>
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
