// @flow

import React, { Component } from 'react';
import { Label, List, Button } from 'semantic-ui-react';

class UserPollCard extends Component {
  shouldComponentUpdate() {
    return false;
  }
  props: AbstractPoll;
  render() {
    return (
      <List.Item>
        <List.Content floated="right">
          <Button>Delete</Button>
        </List.Content>
        <List.Content floated="left">
          <Label color="purple" horizontal>
            {this.props.voteNum}
          </Label>
        </List.Content>
        <List.Content as="a" href={`/polls/${this.props._id}`}>
          <List.Header>{this.props.title}</List.Header>
        </List.Content>
      </List.Item>
    );
  }
}

export default UserPollCard;
