// @flow

import React, { Component } from 'react';
import axios from 'axios';
import querystring from 'querystring';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Form, Button, Message, Header, Dimmer, Loader, Popup } from 'semantic-ui-react';
import { fetchAllPolls, setAddPollModal } from './actionCreators';

class NewPollForm extends Component {
  state = {
    title: '',
    options: ['', ''],
    optionKey: [1, 2],
    isUserOption: false,
    serverErrors: '',
    clientErrors: '',
    isLoading: false,
    redirect: ''
  };
  onSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    if (this.hasDuplicate(this.state.options)) {
      this.setState({ clientErrors: 'Please remove duplicate options' });
    } else {
      this.setState({ isLoading: true });
      const data = querystring.stringify({
        title: this.state.title,
        options: this.state.options,
        isUserOption: this.state.isUserOption
      });
      axios({
        method: 'post',
        url: '/api/polls',
        // // $FlowFixMe
        data,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then((res: { data: { error?: string, poll: Poll } }) => {
        if (res.data.error) {
          this.setState({ isLoading: false, serverErrors: res.data.error });
        } else if (res.data.poll && res.data.poll._id) {
          this.props.getPolls();
          this.setState({ redirect: `/polls/${res.data.poll._id}` });
          this.props.toggleAddPollModal(false);
        } else {
          this.setState({ isLoading: false, serverErrors: 'Fail to create poll, please try again later' });
        }
      });
    }
  };

  onTitleChange = (event: SyntheticInputEvent) => {
    this.setState({ title: event.target.value });
  };

  onOptionChange = index => (event: SyntheticInputEvent) => {
    const newOptions = this.state.options.map((option, idx) => {
      if (index !== idx) return option;
      return event.target.value;
    });
    this.setState({ options: newOptions, clientErrors: '', serverErrors: '' });
  };

  onAddOption = (event: SyntheticEvent) => {
    event.preventDefault();
    this.state.options.push('');
    this.state.optionKey.push(this.state.options.length);
    this.setState({
      options: this.state.options.slice(),
      optionKey: this.state.optionKey.slice()
    });
  };

  onRemoveOption = (event: SyntheticEvent) => {
    event.preventDefault();
    this.state.options.splice(-1, 1);
    this.state.optionKey.splice(-1, 1);
    this.setState({
      options: this.state.options.slice(),
      optionKey: this.state.optionKey.slice(),
      clientErrors: '',
      serverErrors: ''
    });
  };

  hasDuplicate = array => {
    const arr = array.slice().sort();
    for (let i = 0; i < arr.length - 1; i += 1) {
      if (arr[i] === arr[i + 1]) {
        return true;
      }
    }
    return false;
  };
  props: {
    getPolls: Function,
    toggleAddPollModal: Function
  };

  render() {
    if (this.state.redirect) {
      return (
        <div>
          <Redirect push to={this.state.redirect} />
        </div>
      );
    }

    const isWarning = !!this.state.serverErrors;
    const isError = !!this.state.clientErrors;

    let deleteButton = '';
    if (this.state.options.length > 2) {
      deleteButton = (
        <Popup
          trigger={<Button icon="minus" size="large" onClick={this.onRemoveOption} />}
          content="Remove last option"
        />
      );
    }

    return (
      <div>
        <Header size="huge" className="modalHeader" content="Create a new poll" />
        <Form warning={isWarning} error={isError} onSubmit={this.onSubmit}>
          <Message
            icon="exclamation triangle"
            header="Fail to create poll"
            color="red"
            warning
            content={this.state.serverErrors}
          />
          <Message error content={this.state.clientErrors} />
          <Form.Field>
            <Form.Input
              size="big"
              type="text"
              placeholder="Add Poll Title"
              value={this.state.title}
              onChange={this.onTitleChange}
              required
            />
          </Form.Field>
          {this.state.options.map((option, index) => (
            <Form.Field key={this.state.optionKey[index]}>
              <Form.Input
                size="big"
                required
                type="text"
                placeholder={`Add Option ${index + 1}`}
                value={option}
                onChange={this.onOptionChange(index)}
              />
            </Form.Field>
          ))}
          <Form.Group inline>
            <label htmlFor="userOption">Can user add new option?</label>
            <Form.Radio
              label="Yes"
              value="yes"
              checked={this.state.isUserOption === true}
              onChange={() => {
                this.setState({ isUserOption: true });
              }}
            />
            <Form.Radio
              label="No"
              value="no"
              checked={!this.state.isUserOption === true}
              onChange={() => {
                this.setState({ isUserOption: false });
              }}
            />
          </Form.Group>
          <Popup trigger={<Button icon="plus" size="large" onClick={this.onAddOption} />} content="Add a new option" />
          {deleteButton}
          <Button primary className="newPollSubmit" type="submit" size="large">
            Create Poll
          </Button>
        </Form>
        <Dimmer inverted active={this.state.isLoading}>
          <Loader />
        </Dimmer>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  getPolls() {
    dispatch(fetchAllPolls());
  },
  toggleAddPollModal(isOpen: boolean) {
    dispatch(setAddPollModal(isOpen));
  }
});

export default connect(null, mapDispatchToProps)(NewPollForm);
