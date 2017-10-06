// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
// import Modal from 'react-modal';
import { Form, Menu, Icon, Container, Dropdown, Popup, Modal } from 'semantic-ui-react';
import { fetchUser, setLoginModal, setSignupModal, setAddPollModal, setSearchTerm } from './actionCreators';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import NewPollForm from './NewPollForm';

class Header extends Component {
  state = {
    goSearch: false
  };
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

  goToSearch = (event: SyntheticEvent) => {
    event.preventDefault();
    this.setState({ goSearch: true });
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
    pollID: string,
    searchTerm: string,
    handleSearchTermChange: Function,
    noSearch: boolean,
    isLanding: boolean
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
              open={this.props.loginModal}
              onClose={() => {
                this.props.toggleLoginModal(false);
              }}
            >
              <Icon
                link
                name="close"
                size="big"
                onClick={() => {
                  this.props.toggleLoginModal(false);
                }}
              />
              <div className="Modal">
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
              </div>
            </Modal>
            <Modal
              open={this.props.signupModal}
              onClose={() => {
                this.props.toggleSignupModal(false);
              }}
            >
              <Icon
                link
                name="close"
                size="big"
                onClick={() => {
                  this.props.toggleSignupModal(false);
                }}
              />
              <div className="Modal">
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
              </div>
            </Modal>
          </Menu.Menu>
        );
      default:
        return (
          <Menu.Menu position="right">
            <Popup
              trigger={
                <Menu.Item
                  onClick={() => {
                    this.props.toggleAddPollModal(true);
                  }}
                >
                  <Icon name="plus" />
                </Menu.Item>
              }
              content="Add a new poll"
              position="bottom center"
            />
            <Modal
              open={this.props.addPollModal}
              onClose={() => {
                this.props.toggleAddPollModal(false);
              }}
            >
              <Icon
                link
                name="close"
                size="big"
                onClick={() => {
                  this.props.toggleAddPollModal(false);
                }}
              />
              <div className="Modal">
                <NewPollForm />
              </div>
            </Modal>
            <Dropdown className="link item" text={userName}>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to="/user/profile">
                  My Profile
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/user/polls">
                  My Polls
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as="a" href="/api/auth/logout">
                  <Icon name="log out" />Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Menu>
        );
    }
  }
  render() {
    if (this.state.goSearch) {
      return (
        <div>
          <Redirect to="/polls" />
        </div>
      );
    }

    let searchBar = '';
    if (!this.props.noSearch) {
      searchBar = (
        <Menu.Item>
          <Form onSubmit={this.goToSearch}>
            <Form.Input
              onChange={this.props.handleSearchTermChange}
              value={this.props.searchTerm}
              type="text"
              size="huge"
              transparent
              icon="search"
              placeholder="Search Polls..."
            />
          </Form>
        </Menu.Item>
      );
    }
    const menuItems = (
      <Container>
        <Menu.Item as={Link} to="/polls">
          <Icon name="home" size="big" />
        </Menu.Item>
        {searchBar}
        {this.renderContent()}
      </Container>
    );

    let menu;
    if (this.props.isLanding) {
      menu = (
        <div className="headerElement">
          <Menu size="massive" secondary inverted>
            {menuItems}
          </Menu>
        </div>
      );
    } else {
      menu = (
        <Menu size="massive" secondary inverted color="grey">
          {menuItems}
        </Menu>
      );
    }
    return <div>{menu}</div>;
  }
}

const mapStateToProps = state => ({
  user: state.user,
  loginModal: state.loginModal,
  signupModal: state.signupModal,
  addPollModal: state.addPollModal,
  searchTerm: state.searchTerm
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
  },
  handleSearchTermChange(event) {
    dispatch(setSearchTerm(event.target.value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
