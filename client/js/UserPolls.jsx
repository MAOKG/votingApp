// @flow

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Message, Dimmer, Loader, List, Container } from 'semantic-ui-react';
import UserPollCard from './UserPollCard';
import Header from './Header';
import { fetchAllPolls } from './actionCreators';

class UserPolls extends Component {
  state = {
    error: ''
  };
  componentDidMount() {
    if (!this.props.userPolls) {
      this.props.getPolls();
    }
  }

  props: {
    user: User,
    userPolls: Polls,
    getPolls: Function
  };
  renderContent() {
    if (this.props.user) {
      if (this.props.userPolls) {
        if (this.props.userPolls.error) {
          return <Message error content={this.props.userPolls.error} />;
        } else if (this.props.userPolls.polls) {
          return (
            <Container>
              <List divided size="big" verticalAlign="middle">
                {this.props.userPolls.polls
                  .filter(poll => poll.author.id === this.props.user._id)
                  .map(poll => <UserPollCard key={poll._id} poll={poll} />)}
              </List>
            </Container>
          );
        }
      }
    }
    return '';
  }
  render() {
    if (this.props.user === false) {
      return (
        <div>
          <Redirect to="/polls" />
        </div>
      );
    }
    return (
      <div className="pageElement">
        <Header isHome={false} />
        <div className="pageBody">{this.renderContent()}</div>
        <Dimmer inverted active={!this.props.userPolls}>
          <Loader />
        </Dimmer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  userPolls: state.allPolls
});

const mapDispatchToProps = (dispatch: Function) => ({
  getPolls() {
    dispatch(fetchAllPolls());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPolls);
