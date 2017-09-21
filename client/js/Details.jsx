// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container } from 'semantic-ui-react';
import { fetchPollDetail } from './actionCreators';
import Header from './Header';
import VotingForm from './VotingForm';

class Details extends Component {
  componentDidMount() {
    if (!this.props.pollDetail) {
      this.props.getPollDetail();
    }
  }
  props: {
    id: String,
    pollDetail: PollDetail,
    getPollDetail: Function
  };
  render() {
    let renderCotent;
    let propID;
    if (this.props.pollDetail) {
      renderCotent = (
        <div>
          <h1>{this.props.pollDetail.hasVoted.toString()}</h1>
          <VotingForm id={this.props.id} options={this.props.pollDetail.poll.options} />
        </div>
      );
      propID = this.props.id;
    } else {
      renderCotent = '';
      propID = '';
    }
    return (
      <div>
        <Header pollID={propID} />
        <Container>
          <h1>Welcome to the detail page {this.props.id}</h1>
          {renderCotent}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const pollDetail = state.pollDetail[ownProps.id] ? state.pollDetail[ownProps.id] : null;
  return {
    pollDetail
  };
};

const mapDispatchToProps = (dispatch: Function, ownProps) => ({
  getPollDetail() {
    dispatch(fetchPollDetail(ownProps.id));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Details);