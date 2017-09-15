// @flow

import React, { Component } from 'react';
// import styled from 'styled-components';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { Menu, Input, Icon, Container } from 'semantic-ui-react';
import { fetchUser } from './actionCreators';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

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
  openSignupModal = () => {
    this.setState({ signupModal: true });
  };
  closeSignupModal = () => {
    this.setState({ signupModal: false });
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
            <Menu.Item name="Signup" onClick={this.openSignupModal} />
            <Modal
              isOpen={this.state.loginModal}
              onRequestClose={this.closeLoginModal}
              shouldCloseOnOverlayClick
              className="Modal"
              contentLabel="Login Modal"
            >
              <Icon link name="close" size="big" onClick={this.closeLoginModal} />
              <LoginForm />
              <Container textAlign="center">
                <h4>
                  Do not have an account?{' '}
                  <a
                    className="modalSwitch"
                    aria-pressed="true"
                    tabIndex="0"
                    role="button"
                    onClick={() => {
                      this.closeLoginModal();
                      this.openSignupModal();
                    }}
                  >
                    Sign up
                  </a>
                </h4>
              </Container>
            </Modal>
            <Modal
              isOpen={this.state.signupModal}
              onRequestClose={this.closeSignupModal}
              shouldCloseOnOverlayClick
              className="Modal"
              contentLabel="Signup Modal"
            >
              <Icon link name="close" size="big" onClick={this.closeSignupModal} />
              <SignupForm />
              <Container textAlign="center">
                <h4>
                  Already have an account?{' '}
                  <a
                    className="modalSwitch"
                    aria-pressed="true"
                    tabIndex="0"
                    role="button"
                    onClick={() => {
                      this.closeSignupModal();
                      this.openLoginModal();
                    }}
                  >
                    Log in
                  </a>
                </h4>
              </Container>
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
      <Menu size="massive" secondary>
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
