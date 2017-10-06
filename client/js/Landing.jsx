// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import type { RouterHistory } from 'react-router-dom';
import { Search, Menu, Container, Header, Button, Form, List, Segment } from 'semantic-ui-react';
import { setSearchTerm, fetchAllPolls } from './actionCreators';
import AppHeader from './Header';
import ShowCard from './ShowCard';
import Footer from './Footer';

const shuffle = pollList => {
  const array = pollList.slice();
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

class Landing extends Component {
  state = {
    searchLoading: false,
    searchResults: [],
    searchValue: '',
    sort: 'Popular'
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
  sortPollList(pollList) {
    return pollList.sort((a, b) => {
      if (this.state.sort === 'New') {
        return new Date(b.postDate) - new Date(a.postDate);
      }
      return b.voteNum - a.voteNum;
    });
  }
  render() {
    const searchButton = this.state.searchValue ? 'Search' : 'Browse All';
    let pollList;
    if (!this.props.allPolls || !this.props.allPolls.polls) {
      pollList = [];
    } else {
      pollList = this.props.allPolls.polls.slice();
      if (this.state.sort === 'Random') {
        pollList = shuffle(pollList).slice(0, 10);
      } else {
        pollList = this.sortPollList(pollList).slice(0, 10);
      }
    }

    return (
      <div className="pageElement">
        <div className="landingContainer">
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
              <Header inverted as="h1" content="Welcome to Voting App" textAlign="center" />
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
                    input={{ icon: 'search', iconPosition: 'left', placeholder: 'Search Polls...' }}
                  />
                  <Button positive size="big" style={{ marginLeft: '10px' }}>
                    {searchButton}
                  </Button>
                </Form.Group>
              </Form>
            </Container>
          </div>
        </div>
        <Menu pointing secondary color="grey" style={{ marginTop: '0px' }}>
          <Container>
            <Menu.Item
              name="Popular"
              active={this.state.sort === 'Popular'}
              onClick={() => {
                if (this.state.sort !== 'Popular') {
                  this.setState({ sort: 'Popular' });
                }
              }}
            />
            <Menu.Item
              name="New"
              active={this.state.sort === 'New'}
              onClick={() => {
                if (this.state.sort !== 'New') {
                  this.setState({ sort: 'New' });
                }
              }}
            />
            <Menu.Item
              name="Random"
              active={this.state.sort === 'Random'}
              onClick={() => {
                this.setState({ sort: 'Random' });
              }}
            />
          </Container>
        </Menu>
        <Segment basic style={{ marginTop: '0px' }} loading={!this.props.allPolls} className="pageBody">
          <Container>
            <List selection size="big" verticalAlign="middle">
              {pollList.map(poll => <ShowCard className="center" key={poll._id} {...poll} />)}
            </List>
          </Container>
        </Segment>
        <Footer />
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
