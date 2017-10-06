// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import type { RouterHistory } from 'react-router-dom';
import { Search, Segment, Container, Header, Button, Form } from 'semantic-ui-react';
import { setSearchTerm, fetchAllPolls } from './actionCreators';
import AppHeader from './Header';

class Landing extends Component {
  state = {
    searchLoading: false,
    searchResults: [],
    searchValue: '',
    sort: 'VoteNum'
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
    handleSubmit: Function,
    // handleSearchTermChange: Function,
    history: RouterHistory,
    allPolls: Polls,
    getPolls: Function
  };
  resetComponent = () =>
    this.setState({
      searchLoading: false,
      searchResults: [],
      searchValue: ''
    });
  goToSearch = (event: SyntheticEvent) => {
    event.preventDefault();
    this.props.handleSubmit(this.state.searchValue);
    this.props.history.push('/polls');
  };
  sortPollList(pollList) {
    return pollList.sort((a, b) => {
      if (this.state.isSortByDate) {
        return new Date(b.postDate) - new Date(a.postDate);
      }
      return b.voteNum - a.voteNum;
    });
  }

  handleSearchChange = (event, { value }) => {
    this.setState({ searchLoading: true, searchValue: value });

    setTimeout(() => {
      if (this.state.searchValue.length < 1) return this.resetComponent();

      const pollList = this.props.allPolls.polls ? this.props.allPolls.polls : [];
      const filterList = pollList
        .filter(poll => `${poll.title}`.toUpperCase().indexOf(this.state.searchValue.toUpperCase()) >= 0)
        .map(poll => (({ title, voteNum }) => ({ title, price: `${voteNum} votes` }))(poll));

      return this.setState({
        searchLoading: false,
        searchResults: filterList
      });
    }, 500);
  };
  handleResultSelect = (event, { result }) => this.setState({ searchValue: result.title });
  render() {
    const searchButton = this.state.searchValue ? 'Search' : 'Browse All';
    return (
      <div className="landing">
        <Segment inverted textAlign="center">
          <AppHeader isLanding noSearch />
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: 500
            }}
          >
            <Container text>
              <Header as="h1" content="Welcome to Voting App" inverted />
              <Form onSubmit={this.goToSearch}>
                <Form.Group
                  inline
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Search
                    size="big"
                    onSearchChange={this.handleSearchChange}
                    onResultSelect={this.handleResultSelect}
                    results={this.state.searchResults}
                    value={this.state.searchValue}
                    aligned="right"
                    loading={this.state.searchLoading}
                    input={{ icon: 'search', iconPosition: 'left' }}
                  />
                  <Button style={{ marginLeft: '10px' }}>{searchButton}</Button>
                </Form.Group>
              </Form>
            </Container>
          </div>
          <div style={{ height: 60 }} />
        </Segment>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allPolls: state.allPolls
});
const mapDispatchToProps = (dispatch: Function) => ({
  handleSubmit(searchTerm) {
    dispatch(setSearchTerm(searchTerm));
  },
  getPolls() {
    dispatch(fetchAllPolls());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
