import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';

const url = 'https://www.stellarbiotechnologies.com/media/press-releases/json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: [],
      offset: 0,
    };
    this.handleOnScroll = this.handleOnScroll.bind(this);
  }

  componentWillMount() {
    window.addEventListener('scroll', this.handleOnScroll);

    this.fetchNewsList();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleOnScroll);
  }

  fetchNewsList() {
    let limit = 20;
    $.ajax({
      url: url,
      dataType: 'json',
      method: 'get',
      data: 'limit=' + limit + '&offset=' + this.state.offset,
      async: true,
      cache: false,
      success: function(data) {
        let newsList = this.state.data.concat(data.news);
        this.setState({
          loading: false,
          data: newsList,
          offset: this.state.data.length - 1,
        });
      }.bind(this),
      error: function(xhr, status, err) {
        //  console.error(url, status, err.toString());
      },
    });
  }

  displayArticles() {
    if (this.state.loading) {
      return <span>Loading...</span>;
    } else {
      return (
        <div>
          {this.state.data.map(data => (
            <p>{`Title: ${data.title} Published: ${data.published}`}</p>
          ))}
        </div>
      );
    }
  }

  handleOnScroll() {
    var scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    var scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    var clientHeight =
      document.documentElement.clientHeight || window.innerHeight;
    var scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

    if (scrolledToBottom) {
      this.fetchNewsList();
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">InCrowd</h1>
        </header>
        {this.displayArticles()}
      </div>
    );
  }
}

export default App;
