// @flow

import React from 'react';
import { connect } from 'react-redux';

const Landing = (props: { user: User }) => {
  let utilSpace;
  if (props.user === null) {
    utilSpace = '';
  } else if (props.user === false) {
    utilSpace = 'Please sign in to see votes';
  } else {
    // $FlowFixMe
    utilSpace = `Welcome to Voting APP ${props.user._id}`; // eslint-disable-line
  }
  return (
    <div>
      <h1>
        {utilSpace}
      </h1>
    </div>
  );
};

Landing.defaultProps = {
  user: null
};

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(Landing);
