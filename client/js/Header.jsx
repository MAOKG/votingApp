// @flow

import React, { Component } from 'react';
// import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { Menu, Input, Icon } from 'semantic-ui-react';
import { fetchUser } from './actionCreators';
import LoginForm from './LoginForm';

Modal.setAppElement('#app');
Modal.defaultStyles.overlay.backgroundColor = 'rgba(0, 0, 0, 0.75)';
class Header extends Component {
  state = {
    loginModal: false,
    signupModal: false
  };
  componentDidMount() {
    this.props.getUser();
  }
  openLoginModal = () => {
    this.setState({ loginModal: true });
  };
  closeLoginModal = () => {
    this.setState({ loginModal: false });
  };
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
            <Menu.Item name="Login" onClick={this.openLoginModal} />
            <Menu.Item name="Signup" as="a" href="/signup" link />
            <Modal
              isOpen={this.state.loginModal}
              onRequestClose={this.closeLoginModal}
              shouldCloseOnOverlayClick
              className="loginModal"
              contentLabel="Login Modal"
            >
              <Icon link name="close" size="big" onClick={this.closeLoginModal} />
              <LoginForm />
            </Modal>
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
