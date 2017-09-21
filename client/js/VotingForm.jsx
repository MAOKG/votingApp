// @flow

import React, { Component } from 'react';
import axios from 'axios';
import querystring from 'querystring';
import { connect } from 'react-redux';
import { Form } from 'semantic-ui-react';
import { fetchPollDetail } from './actionCreators';

class VotingForm extends Component {
  state = {};
  props: {
    id: string,
    user: User,
    getPollDetail: Function,
    options: Array<Object>
  };
  render() {
    return <Form />;
  }
}

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = (dispatch: Function, ownProps) => ({
  getPollDetail() {
    dispatch(fetchPollDetail(ownProps.id));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VotingForm);
