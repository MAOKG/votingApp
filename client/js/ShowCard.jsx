// @flow

import React, { Component } from 'react';
import { Label, List, Icon } from 'semantic-ui-react';
import Moment from 'react-moment';

class ShowCard extends Component {
  shouldComponentUpdate() {
    return false;
  }
  props: AbstractPoll;
  render() {
    return (
      <List.Item as="a" href={`/polls/${this.props._id}`}>
        <List.Content className="hideItem" floated="right">
          <Icon name="time" />
          <Moment fromNow>{new Date(this.props.postDate)}</Moment>
        </List.Content>
        <List.Content className="hideItem" floated="right">
          <Icon name="user" />
          {this.props.author.name}
        </List.Content>
        <List.Content floated="left">
          <Label circular color="grey" horizontal>
            {this.props.voteNum}
          </Label>
        </List.Content>
        <List.Content>
          <List.Header>{this.props.title}</List.Header>
        </List.Content>
      </List.Item>
    );
  }
}

export default ShowCard;
