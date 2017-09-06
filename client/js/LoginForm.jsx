// @flow

import React, { Component } from 'react';
// import axios from 'axios';
// import styled from 'styled-components';

class LoginForm extends Component {
  state = {
    email: '',
    password: '',
    serverErrors: [],
    clientErrors: { email: '', password: '' },
    isLoading: false
  };

  onSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
  };
  onChange = (event: SyntheticInputEvent) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const serverErrors = this.state.serverErrors.length ? '' : this.state.serverErrors[0];
    return (
      <form onSubmit={this.onSubmit}>
        <span>{serverErrors}</span>
        <input
          type="email"
          placeholder="email"
          value={this.state.email}
          name="email"
          onChange={this.onChange}
          required
        />
        <span>{this.state.clientErrors.email}</span>
        <input
          type="password"
          placeholder="password"
          value={this.state.password}
          name="password"
          onChange={this.onChange}
          required
        />
        <span>{this.state.clientErrors.password}</span>
        <button>Login!</button>
      </form>
    );
  }
}

export default LoginForm;
