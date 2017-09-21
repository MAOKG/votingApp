// @flow

import React, { Component } from 'react';
import axios from 'axios';
import querystring from 'querystring';
import { connect } from 'react-redux';
import { Form, Button, Message, Header, Divider, Dimmer, Loader } from 'semantic-ui-react';
import { fetchUser } from './actionCreators';
// import styled from 'styled-components';

class SignupForm extends Component {
  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    serverErrors: '',
    clientErrors: { password: '' },
    isLoading: false
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
      }).then((res: { data: FormRes }) => {
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
    getUser: Function
  };
  render() {
    const isWarning = !!this.state.serverErrors;
    const isError = !!this.state.clientErrors.password;

    return (
      <div>
        <Header className="modalHeader" textAlign="center">
          <Header.Content>
            Sign up with <a href="/api/auth/google">Google</a>
          </Header.Content>
        </Header>
        <Divider horizontal>or</Divider>
        <Form warning={isWarning} error={isError} onSubmit={this.onSubmit}>
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
            Sign up
          </Button>
        </Form>
        <Divider />
        <Dimmer inverted active={this.state.isLoading}>
          <Loader />
        </Dimmer>
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });

const mapDispatchToProps = (dispatch: Function) => ({
  getUser() {
    dispatch(fetchUser());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);
