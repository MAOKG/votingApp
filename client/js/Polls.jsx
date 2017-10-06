// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Message, List, Container, Input, Menu, Segment } from 'semantic-ui-react';
import ShowCard from './ShowCard';
import Header from './Header';
import Footer from './Footer';
import { fetchAllPolls, setSearchTerm, setAddPollModal, setLoginModal } from './actionCreators';

const pageSize = 10;

class Index extends Component {
  state = {
    searchLoading: false,
    searchResults: [],
    searchValue: '',
    isSortByDate: false,
    pageNum: 1
  };
  componentDidMount() {
    if (!this.props.allPolls) {
      this.props.getPolls();
    }
  }
  props: {
    user: User,
    allPolls: Polls,
    getPolls: Function,
    searchTerm: string,
    handleSearchTermChange: Function,
    toggleLoginModal: Function,
    toggleAddPollModal: Function
  };

  sortPollList(pollList) {
    return pollList.sort((a, b) => {
      if (this.state.isSortByDate) {
        return new Date(b.postDate) - new Date(a.postDate);
      }
      return b.voteNum - a.voteNum;
    });
  }

  paginate(array) {
    const pageNumber = this.state.pageNum;
    return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

  render() {
    let renderContent = '';
    if (this.props.allPolls) {
      if (this.props.allPolls.error) {
        renderContent = <Message error content={this.props.allPolls.error} />;
      } else if (this.props.allPolls.polls) {
        let pollList = this.props.allPolls.polls.slice();
        pollList = this.sortPollList(pollList);
        const filterList = pollList.filter(
          poll => `${poll.title}`.toUpperCase().indexOf(this.props.searchTerm.toUpperCase()) >= 0
        );
        const paginateList = this.paginate(filterList);
        if (paginateList.length === 0 && filterList.length > 0) {
          this.setState({ pageNum: 1 });
        }
        let pageButtons = '';
        if (filterList.length > pageSize) {
          const numbersArray = Array.from({ length: Math.ceil(filterList.length / pageSize) }, (v, i) => i + 1);
          const filterNumbersArray = numbersArray.filter(num => {
            if (this.state.pageNum <= 3) {
              return num <= 5;
            }
            if (this.state.pageNum >= numbersArray.length - 2) {
              return num >= numbersArray.length - 4;
            }

            return num >= this.state.pageNum - 2 && num <= this.state.pageNum + 2;
          });
          pageButtons = (
            <div className="centerElement">
              <Button.Group>
                <Button
                  basic
                  icon="left chevron"
                  onClick={() => {
                    if (this.state.pageNum > 1) {
                      this.setState({ pageNum: this.state.pageNum - 1 });
                    }
                  }}
                />
                {filterNumbersArray.map(num => (
                  <Button
                    basic={this.state.pageNum !== num}
                    key={`page${num}`}
                    onClick={() => {
                      this.setState({ pageNum: num });
                    }}
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  basic
                  icon="right chevron"
                  onClick={() => {
                    if (this.state.pageNum < numbersArray.length) {
                      this.setState({ pageNum: this.state.pageNum + 1 });
                    }
                  }}
                />
              </Button.Group>
            </div>
          );
        }

        let noPollButton;
        if (!this.props.user) {
          noPollButton = (
            <h2>
              {' '}
              No polls found,{' '}
              <a
                className="modalSwitch"
                aria-pressed="true"
                tabIndex="0"
                role="button"
                onClick={() => {
                  this.props.toggleLoginModal(true);
                }}
              >
                log in
              </a>{' '}
              to create one
            </h2>
          );
        } else {
          noPollButton = (
            <h2>
              {' '}
              No polls found, click{' '}
              <a
                className="modalSwitch"
                aria-pressed="true"
                tabIndex="0"
                role="button"
                onClick={() => {
                  this.props.toggleAddPollModal(true);
                }}
              >
                here
              </a>{' '}
              to create one
            </h2>
          );
        }
        if (filterList.length < 1) {
          renderContent = <div className="pollNotFound">{noPollButton}</div>;
        } else {
          renderContent = (
            <div>
              <div className="listItems">
                <List selection size="big" verticalAlign="middle">
                  {paginateList.map(poll => <ShowCard className="center" key={poll._id} {...poll} />)}
                </List>
              </div>
              {pageButtons}
            </div>
          );
        }
      }
    }
    return (
      <div className="pageElement">
        <Header noSearch />
        <div className="pageBody">
          <Container>
            <div className="centerElement pageHeader">
              <h1>Explore Polls</h1>
            </div>
            <Menu attached="top" tabular>
              <Menu.Item
                name="Hottest"
                active={!this.state.isSortByDate}
                onClick={() => {
                  if (this.state.isSortByDate) {
                    this.setState({ isSortByDate: false });
                    this.setState({ pageNum: 1 });
                  }
                }}
              />
              <Menu.Item
                name="Newest"
                active={this.state.isSortByDate}
                onClick={() => {
                  if (!this.state.isSortByDate) {
                    this.setState({ isSortByDate: true });
                    this.setState({ pageNum: 1 });
                  }
                }}
              />
              <Menu.Menu position="right">
                <Menu.Item>
                  <Input
                    transparent
                    onChange={this.props.handleSearchTermChange}
                    value={this.props.searchTerm}
                    type="text"
                    size="huge"
                    icon="search"
                    placeholder="Search Polls..."
                  />
                </Menu.Item>
              </Menu.Menu>
            </Menu>
            <Segment attached="bottom" loading={!this.props.allPolls}>
              <div className="pollList">{renderContent} </div>
            </Segment>
          </Container>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  allPolls: state.allPolls,
  searchTerm: state.searchTerm
});

const mapDispatchToProps = (dispatch: Function) => ({
  getPolls() {
    dispatch(fetchAllPolls());
  },
  handleSearchTermChange(event) {
    dispatch(setSearchTerm(event.target.value));
  },
  toggleAddPollModal(isOpen: boolean) {
    dispatch(setAddPollModal(isOpen));
  },
  toggleLoginModal(isOpen: boolean) {
    dispatch(setLoginModal(isOpen));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
