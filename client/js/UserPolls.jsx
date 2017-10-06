// @flow

import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Message, Dimmer, Loader, List, Container } from 'semantic-ui-react';
import UserPollCard from './UserPollCard';
import Header from './Header';
import Footer from './Footer';
import { fetchAllPolls, setAddPollModal } from './actionCreators';

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
    getPolls: Function,
    toggleAddPollModal: Function
  };
  renderContent() {
    if (this.props.user) {
      if (this.props.userPolls) {
        if (this.props.userPolls.error) {
          return <Message error content={this.props.userPolls.error} />;
        } else if (this.props.userPolls.polls) {
          const filterList = this.props.userPolls.polls.filter(poll => poll.author.id === this.props.user._id);
          let userPolls;
          if (filterList.length < 1) {
            userPolls = (
              <div className="userNoPoll">
                <h2>
                  {' '}
                  You do not own any polls, click{' '}
                  <a
                    className="modalSwitch"
                    aria-pressed="true"
                    tabIndex="0"
                    role="button"
                    onClick={() => {
                      this.props.toggleAddPollModal(true);
                    }}
                  >
                    here
                  </a>{' '}
                  to create one
                </h2>
              </div>
            );
          } else {
            userPolls = (
              <List divided size="big" verticalAlign="middle">
                {filterList.map(poll => <UserPollCard key={poll._id} poll={poll} />)}
              </List>
            );
          }
          return (
            <Container>
              <div className="centerElement">
                <h1>My Polls</h1>
              </div>
              {userPolls}
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
        <Header />
        <div className="pageBody">{this.renderContent()}</div>
        <div>
          <Footer />
        </div>
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
  },
  toggleAddPollModal(isOpen: boolean) {
    dispatch(setAddPollModal(isOpen));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserPolls);
