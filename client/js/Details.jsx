// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Header, Dimmer, Loader } from 'semantic-ui-react';
import { fetchPollDetail } from './actionCreators';
import AppHeader from './Header';
import VotingForm from './VotingForm';
import Chart from './Chart';

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
    let pollTitle;
    // = this.props.pollDetail ? this.props.pollDetail.poll.title : '';
    if (this.props.pollDetail) {
      if (this.props.pollDetail.error) {
        pollTitle = 'Poll not found';
        propID = '';
        renderCotent = '';
      } else {
        if (this.props.pollDetail.hasVoted) {
          renderCotent = <Chart options={this.props.pollDetail.poll.options} />;
        } else if (this.props.pollDetail.isOwner) {
          renderCotent = (
            <div>
              <Chart options={this.props.pollDetail.poll.options} />
              <VotingForm id={this.props.id} options={this.props.pollDetail.poll.options} />
            </div>
          );
        } else {
          renderCotent = (
            <div>
              <VotingForm id={this.props.id} options={this.props.pollDetail.poll.options} />
            </div>
          );
        }
        propID = this.props.id;
        pollTitle = this.props.pollDetail.poll.title;
      }
    } else {
      renderCotent = '';
      propID = '';
    }
    return (
      <div className="pageElement">
        <AppHeader pollID={propID} isHome={false} />
        <div className="pageBody">
          <Grid centered columns={2}>
            <Grid.Column>
              <Header size="huge" textAlign="center">
                {pollTitle}
              </Header>
              {renderCotent}
            </Grid.Column>
          </Grid>
        </div>
        <Dimmer inverted active={!this.props.pollDetail}>
          <Loader />
        </Dimmer>
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
