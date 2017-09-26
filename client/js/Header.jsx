// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { Menu, Icon, Container, Dropdown } from 'semantic-ui-react';
import { fetchUser, setLoginModal, setSignupModal, setAddPollModal } from './actionCreators';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import NewPollForm from './NewPollForm';

Modal.setAppElement('#app');
Modal.defaultStyles.overlay.backgroundColor = 'rgba(0, 0, 0, 0.75)';
class Header extends Component {
  componentDidMount() {
    this.props.getUser();
  }
  openLoginModal = () => {
    this.props.toggleLoginModal(true);
  };
  closeLoginModal = () => {
    this.props.toggleLoginModal(false);
  };
  openSignupModal = () => {
    this.props.toggleSignupModal(true);
  };
  closeSignupModal = () => {
    this.props.toggleSignupModal(false);
  };
  openAddPollModal = () => {
    this.props.toggleAddPollModal(true);
  };
  closeAddPollModal = () => {
    this.props.toggleAddPollModal(false);
  };
  props: {
    loginModal: boolean,
    signupModal: boolean,
    addPollModal: boolean,
    toggleLoginModal: Function,
    toggleSignupModal: Function,
    toggleAddPollModal: Function,
    user: User,
    getUser: Function,
    pollID: string
  };
  renderContent() {
    let userName;
    if (this.props.user) {
      // $FlowFixMe
      userName = this.props.user.local ? this.props.user.local.firstName : this.props.user.google.name;
    } else {
      userName = '';
    }
    switch (this.props.user) {
      case null:
        return '';
      case false:
        return (
          <Menu.Menu position="right">
            <Menu.Item
              name="Login"
              onClick={() => {
                this.props.toggleLoginModal(true);
              }}
            />
            <Menu.Item
              name="Signup"
              onClick={() => {
                this.props.toggleSignupModal(true);
              }}
            />
            <Modal
              isOpen={this.props.loginModal}
              onRequestClose={() => {
                this.props.toggleLoginModal(false);
              }}
              shouldCloseOnOverlayClick
              className="Modal"
              contentLabel="Login Modal"
            >
              <Icon
                link
                name="close"
                size="big"
                onClick={() => {
                  this.props.toggleLoginModal(false);
                }}
              />
              <LoginForm pollID={this.props.pollID} />
              <Container textAlign="center">
                <h4>
                  Do not have an account?{' '}
                  <a
                    className="modalSwitch"
                    aria-pressed="true"
                    tabIndex="0"
                    role="button"
                    onClick={() => {
                      this.props.toggleLoginModal(false);
                      this.props.toggleSignupModal(true);
                    }}
                  >
                    Sign up
                  </a>
                </h4>
              </Container>
            </Modal>
            <Modal
              isOpen={this.props.signupModal}
              onRequestClose={() => {
                this.props.toggleSignupModal(false);
              }}
              shouldCloseOnOverlayClick
              className="Modal"
              contentLabel="Signup Modal"
            >
              <Icon
                link
                name="close"
                size="big"
                onClick={() => {
                  this.props.toggleSignupModal(false);
                }}
              />
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
                      this.props.toggleSignupModal(false);
                      this.props.toggleLoginModal(true);
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
            <Menu.Item
              onClick={() => {
                this.props.toggleAddPollModal(true);
              }}
            >
              <Icon name="plus" />
              Add Poll
            </Menu.Item>
            <Modal
              isOpen={this.props.addPollModal}
              onRequestClose={() => {
                this.props.toggleAddPollModal(false);
              }}
              shouldCloseOnOverlayClick
              className="Modal"
              contentLabel="AddPoll Modal"
            >
              <Icon
                link
                name="close"
                size="big"
                onClick={() => {
                  this.props.toggleAddPollModal(false);
                }}
              />
              <NewPollForm />
            </Modal>
            <Dropdown className="link item" text={userName} pointing>
              <Dropdown.Menu>
                <Dropdown.Item>Profile</Dropdown.Item>
                <Dropdown.Item as={Link} to="/user/polls">
                  My Polls
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as="a" href="/api/auth/logout">
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        );
    }
  }
  render() {
    return (
      <Menu size="massive" stackable>
        <Menu.Item as={Link} to="/polls">
          VotingApp
        </Menu.Item>

        {this.renderContent()}
      </Menu>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  loginModal: state.loginModal,
  signupModal: state.signupModal,
  addPollModal: state.addPollModal
});

const mapDispatchToProps = (dispatch: Function) => ({
  getUser() {
    dispatch(fetchUser());
  },
  toggleLoginModal(isOpen: boolean) {
    dispatch(setLoginModal(isOpen));
  },
  toggleSignupModal(isOpen: boolean) {
    dispatch(setSignupModal(isOpen));
  },
  toggleAddPollModal(isOpen: boolean) {
    dispatch(setAddPollModal(isOpen));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
