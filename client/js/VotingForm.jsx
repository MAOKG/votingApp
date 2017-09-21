// @flow

import React, { Component } from 'react';
import axios from 'axios';
import querystring from 'querystring';
import { connect } from 'react-redux';
import { Form, Radio } from 'semantic-ui-react';
import { fetchPollDetail } from './actionCreators';

class VotingForm extends Component {
  state = {
    selectOption: '',
    isExtraOption: false,
    extraOption: ''
  };
  onSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
  };
  handleChange = (event, { value }) => {
    this.setState({ selectOption: value, isExtraOption: false });
  };
  handleExtraOption = () => {
    this.setState({ isExtraOption: true, selectOption: '' });
  };
  handleExtraChange = (event: SyntheticInputEvent) => {
    this.setState({ extraOption: event.target.value });
  };
  props: {
    id: string,
    user: User,
    getPollDetail: Function,
    options: Array<Object>
  };
  render() {
    const optionRadios = this.props.options.map(option => (
      <Form.Field
        key={this.props.id + option.name}
        control={Radio}
        label={option.name}
        value={option.name}
        checked={this.state.selectOption === option.name}
        onChange={this.handleChange}
      />
    ));
    const extraInput = (
      <Form.Input
        type="text"
        placeholder="Add new option"
        value={this.state.extraOption}
        onChange={this.handleExtraChange}
      />
    );

    const textArea = this.state.isExtraOption ? extraInput : '';

    return (
      <Form onSubmit={this.onSubmit}>
        {optionRadios}{' '}
        <Form.Field
          key={this.props.id}
          control={Radio}
          label="Others (please sepecify)"
          value={this.state.selectOption}
          checked={this.state.isExtraOption}
          onChange={this.handleExtraOption}
        />
        {textArea}
      </Form>
    );
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
