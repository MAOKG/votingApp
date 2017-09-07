// @flow

import React, { Component } from 'react';
import axios from 'axios';
import querystring from 'querystring';
import { connect } from 'react-redux';
import { fetchUser } from './actionCreators';
import Spinner from './Spinner';
// import styled from 'styled-components';

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
            'Minimum eight and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character'
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
    this.setState({ password: event.target.value, clientErrors: { password: '' } });
  };
  props: {
    user: User,
    getUser: Function,
    history: {
      push: Function
    }
  };

  render() {
    if (this.props.user) {
      this.props.history.push('/');
    }
    let formComponent;
    if (this.state.isLoading) {
      formComponent = <Spinner />;
    } else
      formComponent = (
        <div>
          <form onSubmit={this.onSubmit}>
            <p>{this.state.serverErrors}</p>
            <div>
              <input
                type="email"
                placeholder="email"
                value={this.state.email}
                name="email"
                onChange={this.onEmailChange}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="password"
                value={this.state.password}
                name="password"
                onChange={this.onPasswordChange}
                required
              />
              <p>{this.state.clientErrors.password}</p>
            </div>
            <button>Login!</button>
          </form>
          <button>
            <a href="/auth/google">Login with Google</a>
          </button>
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
