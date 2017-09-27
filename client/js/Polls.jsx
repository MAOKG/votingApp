// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Message, Dimmer, Loader, List, Container } from 'semantic-ui-react';
import ShowCard from './ShowCard';
import Header from './Header';
import { fetchAllPolls } from './actionCreators';

class Index extends Component {
  state = {
    isSortByDate: false
  };
  componentDidMount() {
    if (!this.props.allPolls) {
      this.props.getPolls();
    }
  }
  props: {
    allPolls: Polls,
    getPolls: Function,
    searchTerm: string // eslint-disable-line react/no-unused-prop-types
  };

  sortPollList(pollList) {
    return pollList.sort((a, b) => {
      if (this.state.isSortByDate) {
        return new Date(b.postDate) - new Date(a.postDate);
      }
      return b.voteNum - a.voteNum;
    });
  }

  render() {
    let renderContent = '';
    if (this.props.allPolls) {
      if (this.props.allPolls.error) {
        renderContent = <Message error content={this.props.allPolls.error} />;
      } else if (this.props.allPolls.polls) {
        let pollList = this.props.allPolls.polls;
        pollList = this.sortPollList(pollList);
        renderContent = (
          <List selection size="big" verticalAlign="middle">
            {pollList
              .filter(
                poll =>
                  `${poll.title} ${poll.author.name}`.toUpperCase().indexOf(this.props.searchTerm.toUpperCase()) >= 0
              )
              .map(poll => <ShowCard className="center" key={poll._id} {...poll} />)}
          </List>
        );
      }
    }
    return (
      <div>
        <Header />
        <Container>
          <h2 className="pollListHeader">Sort by</h2>
          <Button.Group size="mini">
            <Button
              toggle
              active={!this.state.isSortByDate}
              onClick={() => {
                this.setState({ isSortByDate: false });
              }}
            >
              Votes
            </Button>
            <Button.Or />
            <Button
              toggle
              active={this.state.isSortByDate}
              onClick={() => {
                this.setState({ isSortByDate: true });
              }}
            >
              Date
            </Button>
          </Button.Group>
          {renderContent}{' '}
        </Container>
        <Dimmer inverted active={!this.props.allPolls}>
          <Loader />
        </Dimmer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allPolls: state.allPolls,
  searchTerm: state.searchTerm
});

const mapDispatchToProps = (dispatch: Function) => ({
  getPolls() {
    dispatch(fetchAllPolls());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
