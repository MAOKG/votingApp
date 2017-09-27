// @flow

import React, { Component } from 'react';
import axios from 'axios';
import querystring from 'querystring';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Modal from 'react-modal';
import { Icon, Grid, Button, Card, Dimmer, Loader, Form, Message } from 'semantic-ui-react';
import { fetchUser } from './actionCreators';
import Header from './Header';

Modal.setAppElement('#app');
Modal.defaultStyles.overlay.backgroundColor = 'rgba(0, 0, 0, 0.75)';
class Profile extends Component {
  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    serverErrors: '',
    clientErrors: { password: '' },
    isLoading: false,
    localModal: false
  };

  onSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
    const passwordRegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    const { password, email, firstName, lastName } = this.state;
    if (!passwordRegExp.test(password)) {
      this.setState({
        clientErrors: {
          password:
            'Password should be minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
        }
      });
    } else {
      this.setState({ isLoading: true });
      const data = querystring.stringify({
        email,
        password,
        firstName,
        lastName
      });
      axios({
        method: 'post',
        url: '/api/auth/signup',
        // // $FlowFixMe
        data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res: { data: UserFormRes }) => {
        if (res.data.user) {
          this.props.getUser();
        } else if (res.data.message) {
          this.setState({ isLoading: false, serverErrors: res.data.message });
        } else {
          this.setState({ isLoading: false, serverErrors: 'Fail to sign up, please try again!' });
        }
      });
    }
  };
  onChange = (event: SyntheticInputEvent) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  onEmailChange = (event: SyntheticInputEvent) => {
    this.setState({ email: event.target.value, serverErrors: '' });
  };
  onPasswordChange = (event: SyntheticInputEvent) => {
    this.setState({ password: event.target.value, clientErrors: { password: '' }, serverErrors: '' });
  };

  props: {
    user: User,
    getUser: Function
  };

  localCard() {
    let name = '';
    let email = '';
    let button = '';
    const user = this.props.user;
    if (user) {
      if (user.local) {
        name = `${user.local.firstName} ${user.local.lastName}`;
        email = user.local.email;
        if (user.google) {
          button = (
            <Card.Content extra>
              <Button basic color="red" as="a" href="/api/auth/unlink/local">
                Disconnect
              </Button>
            </Card.Content>
          );
        }
      } else {
        const isWarning = !!this.state.serverErrors;
        const isError = !!this.state.clientErrors.password;
        button = (
          <Card.Content extra>
            <Button
              basic
              color="green"
              onClick={() => {
                this.setState({ localModal: true });
              }}
            >
              Connect
            </Button>

            <Modal
              isOpen={this.state.localModal}
              onRequestClose={() => {
                this.setState({ localModal: false });
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
                  this.setState({ localModal: false });
                }}
              />
              <Form warning={isWarning} error={isError} onSubmit={this.onSubmit}>
                <h2 className="modalHeader">Connect local account</h2>
                <Message
                  icon="exclamation triangle"
                  header="Sign Up Failed"
                  color="red"
                  warning
                  content={this.state.serverErrors}
                />
                <Form.Field>
                  <Form.Input
                    icon="mail outline"
                    type="email"
                    placeholder="Email address"
                    value={this.state.email}
                    name="email"
                    size="big"
                    onChange={this.onEmailChange}
                    required
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Input
                    icon="user outline"
                    type="text"
                    placeholder="First name"
                    value={this.state.firstName}
                    name="firstName"
                    size="big"
                    onChange={this.onChange}
                    required
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Input
                    icon="user outline"
                    type="text"
                    placeholder="Last name"
                    value={this.state.lastName}
                    name="lastName"
                    size="big"
                    onChange={this.onChange}
                    required
                  />
                </Form.Field>
                <Form.Field>
                  <Form.Input
                    error={isError}
                    icon="lock"
                    type="password"
                    placeholder="Create a Password"
                    value={this.state.password}
                    name="password"
                    size="big"
                    onChange={this.onPasswordChange}
                    required
                  />
                  <Message error content={this.state.clientErrors.password} />
                </Form.Field>
                <Button size="big" fluid color="red" type="submit">
                  Sign up local account
                </Button>
              </Form>
              <Dimmer inverted active={this.state.isLoading}>
                <Loader />
              </Dimmer>
            </Modal>
          </Card.Content>
        );
      }
    }
    return (
      <Card>
        <Card.Content>
          <Card.Header>Local Account</Card.Header>
          <Card.Meta>{name}</Card.Meta>
          <Card.Meta>{email}</Card.Meta>
        </Card.Content>
        {button}
      </Card>
    );
  }

  googleCard() {
    let name = '';
    let button = '';
    const user = this.props.user;
    if (user) {
      if (user.google) {
        name = `${user.google.name}`;
        if (user.local) {
          button = (
            <Card.Content extra>
              <Button basic color="red" as="a" href="/api/auth/unlink/google">
                Disconnect
              </Button>
            </Card.Content>
          );
        }
      } else {
        button = (
          <Card.Content extra>
            <Button basic color="green" as="a" href="/api/auth/google">
              Connect
            </Button>
          </Card.Content>
        );
      }
    }
    return (
      <Card>
        <Card.Content>
          <Card.Header>Google Account</Card.Header>
          <Card.Meta>{name}</Card.Meta>
        </Card.Content>
        {button}
      </Card>
    );
  }

  render() {
    if (this.props.user === false) {
      return (
        <div>
          <Redirect to="/polls" />
        </div>
      );
    }
    return (
      <div>
        <Header />
        <Grid centered columns={2}>
          <Grid.Column>
            <Card.Group>
              {this.localCard()}
              {this.googleCard()}
            </Card.Group>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = (dispatch: Function) => ({
  getUser() {
    dispatch(fetchUser());
  }
});
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
