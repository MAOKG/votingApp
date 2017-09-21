// @flow

import React, { Component } from 'react';
import { Label, List, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class ShowCard extends Component {
  shouldComponentUpdate() {
    return false;
  }
  props: Poll;
  render() {
    return (
      <List.Item as={Link} to={`/polls/${this.props._id}`}>
        <List.Content className="rightItem" floated="right">
          <Icon name="time" />
          {new Date(this.props.postDate).toDateString()}
        </List.Content>
        <List.Content className="rightItem" floated="right">
          <Icon name="user" />
          {this.props.author.name}
        </List.Content>
        <List.Content floated="left">
          <Label clor="purple" horizontal>
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
