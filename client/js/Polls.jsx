// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Message, Dimmer, Loader, List, Container } from 'semantic-ui-react';
import ShowCard from './ShowCard';
import Header from './Header';
import { fetchAllPolls } from './actionCreators';

const Index = (props: { allPolls: Polls, getPolls: Function }) => {
  let renderContent = '';
  if (!props.allPolls) {
    props.getPolls();
  } else if (props.allPolls.error) {
    renderContent = <Message error content={props.allPolls.error} />;
  } else if (props.allPolls.polls) {
    renderContent = (
      <Container>
        <List selection size="big" verticalAlign="middle">
          {props.allPolls.polls.map(poll => <ShowCard key={poll._id} {...poll} />)}
        </List>
      </Container>
    );
  }
  return (
    <div>
      <Header />
      {renderContent}{' '}
      <Dimmer inverted active={!props.allPolls}>
        <Loader />
      </Dimmer>
    </div>
  );
};

const mapStateToProps = state => ({
  allPolls: state.allPolls
});

const mapDispatchToProps = (dispatch: Function) => ({
  getPolls() {
    dispatch(fetchAllPolls());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
