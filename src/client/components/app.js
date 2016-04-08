import React from 'react';
import ConfigsList from './configs-list';
import SockJS from 'sockjs-client';

var sockjs_url = 'http://localhost:3000/echo';
var sockjs = new SockJS(sockjs_url);

export default class App extends React.Component {
  render() {
    return (
      <div className="page-container">
        <h1 className="title">CalCentral Monitor</h1>
        <h3 className="time">Last updated at {this.generateTime()}</h3>
        <ConfigsList data={this.state}/>
      </div>
    );
  }
  componentDidMount() {
    sockjs.onmessage = function(e) {
      if (!e || !e.data) {
        return;
      }
      var data = JSON.parse(e.data);
      console.log('data:', data);
      this.setState(data);
    }.bind(this);
  }
  generateTime() {
    if (this.state) {
      return this.state.time;
    }
  }
}
