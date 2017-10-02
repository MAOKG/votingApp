// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import type { RouterHistory } from 'react-router-dom';
import { Input } from 'semantic-ui-react';
import { setSearchTerm } from './actionCreators';

class Landing extends Component {
  props: {
    searchTerm: string,
    handleSearchTermChange: Function,
    history: RouterHistory
  };
  goToSearch = (event: SyntheticEvent) => {
    event.preventDefault();
    this.props.history.push('/polls');
  };
  render() {
    const searchButton = this.props.searchTerm ? 'Search' : 'Browse All';
    return (
      <div className="landing">
        <div id="landing-header">
          <h1>Welcome to VotingApp!</h1>
          <form onSubmit={this.goToSearch}>
            <Input
              size="huge"
              action={{ color: 'green', content: searchButton }}
              onChange={this.props.handleSearchTermChange}
              value={this.props.searchTerm}
              type="text"
              placeholder="Search"
            />
          </form>
        </div>

        <ul className="slideshow">
          <li />
          <li />
          <li />
          <li />
          <li />
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({ searchTerm: state.searchTerm });
const mapDispatchToProps = (dispatch: Function) => ({
  handleSearchTermChange(event) {
    dispatch(setSearchTerm(event.target.value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
