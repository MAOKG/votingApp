// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Dimmer, Loader, Container, Icon, Popup } from 'semantic-ui-react';
import { fetchPollDetail } from './actionCreators';
import Header from './Header';
import VotingForm from './VotingForm';
import Chart from './Chart';
import Footer from './Footer';

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
  handleTweet = () => {
    const height = 420;
    const width = 550;
    const left = window.outerWidth / 2 + (window.screenX || window.screenLeft || 0) - width / 2;
    const top = window.outerHeight / 2 + (window.screenY || window.screenTop || 0) - height / 2;
    const config = {
      height,
      width,
      left,
      top,
      location: 'no',
      toolbar: 'no',
      status: 'no',
      directories: 'no',
      menubar: 'no',
      scrollbars: 'yes',
      resizable: 'no',
      centerscreen: 'yes',
      chrome: 'yes'
    };
    const windowConfig = Object.keys(config)
      .map(key => `${key}=${config[key]}`)
      .join(',');
    const text = `${this.props.pollDetail.poll.title}, Let's vote at `;
    const url = `https://votingapp.com/polls/${this.props.pollDetail.poll._id}`;
    const hashtags = `${this.props.pollDetail.poll.title}, VotingApp`;
    const tweetObj = { text, url, hashtags };
    const tweetConfig = Object.keys(tweetObj)
      .map(key => `${key}=${encodeURIComponent(tweetObj[key])}`)
      .join('&');
    window.open(`https://twitter.com/intent/tweet?${tweetConfig}`, 'Tweet Window', windowConfig);
  };

  render() {
    let chart;
    let form;
    let propID;
    let pollTitle;
    if (this.props.pollDetail) {
      if (this.props.pollDetail.error) {
        pollTitle = <h1>Poll not found</h1>;
        propID = '';
        chart = '';
        form = '';
      } else {
        if (this.props.pollDetail.hasVoted) {
          chart = <Chart options={this.props.pollDetail.poll.options} />;
          form = <h3>You have already voted</h3>;
        } else if (this.props.pollDetail.isOwner) {
          if (this.props.pollDetail.poll.voteNum === 0) {
            chart = '';
          } else {
            chart = <Chart options={this.props.pollDetail.poll.options} />;
          }
          form = <VotingForm id={this.props.id} options={this.props.pollDetail.poll.options} />;
        } else {
          chart = '';
          form = <VotingForm id={this.props.id} options={this.props.pollDetail.poll.options} />;
        }
        propID = this.props.id;
        pollTitle = (
          <div className="pageHeader">
            <div className="centerElement">
              <h1>{this.props.pollDetail.poll.title}</h1>
            </div>
            <div className="centerElement tweetButton">
              <Popup
                trigger={<Icon name="twitter square" size="large" link onClick={this.handleTweet} />}
                content="Share on twitter"
              />
            </div>
          </div>
        );
      }
    } else {
      chart = '';
      form = '';
      propID = '';
    }
    return (
      <div className="pageElement">
        <Header pollID={propID} />
        <div className="pageBody">
          <Container>
            {pollTitle}
            <Grid centered columns={1}>
              <Grid.Column>{chart}</Grid.Column>
            </Grid>
            <div className="centerElement">{form}</div>
          </Container>
        </div>
        <div>
          <Footer />
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
