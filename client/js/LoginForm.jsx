// @flow

import React, { Component } from 'react';
import axios from 'axios';
import querystring from 'querystring';
import { connect } from 'react-redux';
import { Form, Button, Icon, Message, Header, Divider } from 'semantic-ui-react';
// import styled from 'styled-components';
import { fetchUser } from './actionCreators';
import Spinner from './Spinner';

class LoginForm extends Component {
  state = {
    email: '',
    password: '',
    serverErrors: '',
    clientErrors: { password: '' },
    isLoading: false
  };

  onSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    // Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character
    const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,10}/;
    const { password, email } = this.state;
    if (!passwordRegExp.test(password)) {
      this.setState({
        clientErrors: {
          password:
            'Password should be minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character'
        }
      });
    } else {
      this.setState({ isLoading: true });
      const data = querystring.stringify({
        email,
        password
      });
      axios({
        method: 'post',
        url: '/auth/login',
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
          this.setState({ isLoading: false, serverErrors: 'Fail to sign in, please try again!' });
        }
      });
    }
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

    let formComponent;
    if (this.state.isLoading) {
      formComponent = <Spinner />;
    } else
      formComponent = (
        <div>
          <Header size="huge" className="modalHeader" content="Log in to continue" />
          <Form warning={isWarning} error={isError} onSubmit={this.onSubmit}>
            <Message
              icon="exclamation triangle"
              header="Login Failed"
              color="red"
              warning
              content={this.state.serverErrors}
            />
            <Form.Field>
              <Form.Input
                icon="mail outline"
                type="email"
                placeholder="Email Address"
                value={this.state.email}
                name="email"
                size="big"
                onChange={this.onEmailChange}
                required
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                error={isError}
                icon="lock"
                type="password"
                placeholder="Password"
                value={this.state.password}
                name="password"
                size="big"
                onChange={this.onPasswordChange}
                required
              />
              <Message error content={this.state.clientErrors.password} />
            </Form.Field>
            <Button size="big" fluid color="red" type="submit">
              Log in
            </Button>
          </Form>
          <Divider horizontal>or continue with</Divider>
          <a href="/auth/google">
            <Button size="large" fluid basic color="black" link>
              <Icon name="google" />
              Google
            </Button>
          </a>
          <Divider />
        </div>
      );
    return <div>{formComponent}</div>;
  }
}

const mapStateToProps = state => ({ user: state.user });

const mapDispatchToProps = (dispatch: Function) => ({
  getUser() {
    dispatch(fetchUser());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
