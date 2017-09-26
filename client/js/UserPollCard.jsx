// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Label, List, Button } from 'semantic-ui-react';
import { fetchAllPolls } from './actionCreators';

class UserPollCard extends Component {
  shouldComponentUpdate() {
    return false;
  }

  handleDelete = () => {
    axios
      .delete(`/api/polls/${this.props.poll._id}`)
      .then((res: { data: { success?: string } }) => {
        if (res.data.success) {
          this.props.getPolls();
        }
      })
      .catch(error => {
        console.log('axios error', error); // eslint-disable-line no-console
      });
  };
  props: {
    poll: AbstractPoll,
    getPolls: Function
  };
  render() {
    return (
      <List.Item>
        <List.Content floated="right">
          <Button basic negative onClick={this.handleDelete}>
            Delete
          </Button>
        </List.Content>
        <List.Content floated="left">
          <Label color="purple" horizontal>
            {this.props.poll.voteNum}
          </Label>
        </List.Content>
        <List.Content>
          <List.Header as="a" href={`/polls/${this.props.poll._id}`}>
            {this.props.poll.title}
          </List.Header>
        </List.Content>
      </List.Item>
    );
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  getPolls() {
    dispatch(fetchAllPolls());
  }
});

export default connect(null, mapDispatchToProps)(UserPollCard);
