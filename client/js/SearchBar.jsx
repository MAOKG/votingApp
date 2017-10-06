// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Search } from 'semantic-ui-react';
import { fetchAllPolls } from './actionCreators';

class SearchBar extends Component {
  state = {
    searchLoading: false,
    searchResults: [],
    searchValue: ''
  };
  componentWillMount() {
    this.resetComponent();
  }
  componentDidMount() {
    if (!this.props.allPolls) {
      this.props.getPolls();
    }
  }
  props: {
    allPolls: Polls,
    getPolls: Function
  };
  resetComponent = () =>
    this.setState({
      searchLoading: false,
      searchResults: [],
      searchValue: ''
    });
  handleSearchChange = (event, { value }) => {
    this.setState({ searchLoading: true, searchValue: value });

    setTimeout(() => {
      if (this.state.searchValue.length < 1) return this.resetComponent();

      const pollList = this.props.allPolls && this.props.allPolls.polls ? this.props.allPolls.polls : [];
      const filterList = pollList
        .filter(poll => `${poll.title}`.toUpperCase().indexOf(this.state.searchValue.toUpperCase()) >= 0)
        .map(poll => (({ title, voteNum }) => ({ title, price: `${voteNum} votes` }))(poll))
        .slice(0, 10);

      return this.setState({
        searchLoading: false,
        searchResults: filterList
      });
    }, 500);
  };
  handleResultSelect = (event, { result }) => this.setState({ searchValue: result.title });

  render() {
    return (
      <Search
        size="big"
        onSearchChange={this.handleSearchChange}
        onResultSelect={this.handleResultSelect}
        results={this.state.searchResults}
        value={this.state.searchValue}
        aligned="right"
        loading={this.state.searchLoading}
        input={{ icon: 'search', iconPosition: 'left', placeholder: 'Search Polls...' }}
      />
    );
  }
}

const mapStateToProps = state => ({
  allPolls: state.allPolls
});
const mapDispatchToProps = (dispatch: Function) => ({
  getPolls() {
    dispatch(fetchAllPolls());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
