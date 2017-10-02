// @flow

import React, { Component } from 'react';
import axios from 'axios';
import querystring from 'querystring';
import { connect } from 'react-redux';
import { Form, Radio, Button, Message } from 'semantic-ui-react';
import { fetchPollDetail, setLoginModal } from './actionCreators';

class VotingForm extends Component {
  state = {
    selectOption: '',
    isExtraOption: false,
    extraOption: '',
    isLoading: false,
    error: ''
  };
  onSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    if (this.props.user) {
      const option = this.state.isExtraOption ? this.state.extraOption : this.state.selectOption;
      if (!option) {
        if (this.state.isExtraOption) {
          this.setState({ error: 'Please specify the new option you want to add' });
        } else {
          this.setState({ error: 'Please select an option' });
        }
      } else {
        this.setState({ isLoading: true });
        const data = querystring.stringify({
          option
        });
        axios({
          method: 'put',
          url: `/api/polls/${this.props.id}`,
          // // $FlowFixMe
          data,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then((res: { data: PollFormRes }) => {
          if (res.data.poll) {
            this.props.getPollDetail(this.props.id);
          } else if (res.data.error) {
            this.setState({ error: res.data.error, isLoading: false });
          } else {
            this.setState({ error: 'Fail to vote, please try again later!', isLoading: false });
          }
        });
      }
    }
  };
  handleChange = (event, { value }) => {
    this.setState({ selectOption: value, isExtraOption: false, error: '' });
  };
  handleExtraOption = () => {
    this.setState({ isExtraOption: true, selectOption: '', error: '' });
  };
  handleExtraChange = (event: SyntheticInputEvent) => {
    this.setState({ extraOption: event.target.value, error: '' });
  };
  props: {
    id: string,
    user: User,
    getPollDetail: Function,
    toggleLoginModal: Function,
    options: Array<Object>
  };
  renderButton() {
    switch (this.props.user) {
      case null:
        return '';
      case false:
        return (
          <Button
            onClick={() => {
              this.props.toggleLoginModal(true);
            }}
          >
            Log in to vote
          </Button>
        );
      default:
        return (
          <Button positive type="submit">
            Vote
          </Button>
        );
    }
  }
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
        size="tiny"
        type="text"
        placeholder="Add new option"
        value={this.state.extraOption}
        onChange={this.handleExtraChange}
        className="votingExtraInput"
      />
    );

    const textArea = this.state.isExtraOption ? extraInput : '';

    return (
      <Form size="massive" error={!!this.state.error} onSubmit={this.onSubmit}>
        <Message error content={this.state.error} />
        {optionRadios}{' '}
        <Form.Field
          key={this.props.id}
          control={Radio}
          label="Others (please specify)"
          value={this.state.selectOption}
          checked={this.state.isExtraOption}
          onChange={this.handleExtraOption}
        />
        {textArea}
        {this.renderButton()}
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
  },
  toggleLoginModal(isOpen: boolean) {
    dispatch(setLoginModal(isOpen));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(VotingForm);
