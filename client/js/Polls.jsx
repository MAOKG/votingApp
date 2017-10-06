// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Message, Dimmer, Loader, List, Container } from 'semantic-ui-react';
import ShowCard from './ShowCard';
import Header from './Header';
import Footer from './Footer';
import { fetchAllPolls } from './actionCreators';

const pageSize = 10;

class Index extends Component {
  state = {
    isSortByDate: true,
    pageNum: 1
  };
  componentDidMount() {
    if (!this.props.allPolls) {
      this.props.getPolls();
    }
  }
  props: {
    allPolls: Polls,
    getPolls: Function,
    searchTerm: string // eslint-disable-line react/no-unused-prop-types
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
        let pollList = this.props.allPolls.polls;
        pollList = this.sortPollList(pollList);
        const filterList = pollList.filter(
          poll => `${poll.title} ${poll.author.name}`.toUpperCase().indexOf(this.props.searchTerm.toUpperCase()) >= 0
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
    return (
      <div className="pageElement">
        <Header noSearch />
        <div className="pageBody">
          <Container>
            <div className="centerElement pageHeader">
              <h1>Explore Polls</h1>
            </div>
            <div className="centerElement">
              <Button.Group size="mini">
                <Button
                  basic={this.state.isSortByDate}
                  color="grey"
                  onClick={() => {
                    this.setState({ isSortByDate: false });
                  }}
                >
                  Hottest
                </Button>
                <Button
                  basic={!this.state.isSortByDate}
                  color="grey"
                  onClick={() => {
                    this.setState({ isSortByDate: true });
                  }}
                >
                  Newest
                </Button>
              </Button.Group>
            </div>
            <div className="pollList">{renderContent} </div>
          </Container>
        </div>
        <div>
          <Footer />
        </div>
        <Dimmer inverted active={!this.props.allPolls}>
          <Loader />
        </Dimmer>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  allPolls: state.allPolls,
  searchTerm: state.searchTerm
});

const mapDispatchToProps = (dispatch: Function) => ({
  getPolls() {
    dispatch(fetchAllPolls());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Index);
