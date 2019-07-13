import React, { Component } from 'react'
import socketIOClient from 'socket.io-client'

class Landing extends Component {
  constructor() {
    super();
    this.state = {
      endpoint: "localhost:4200",
      userCount: 0
    };
    this.onChangeUserCount = this.onChangeUserCount.bind(this)
    this.onChangeUserCount();
  }

  onChangeUserCount() {
      const socket = socketIOClient(this.state.endpoint);
      socket.on('userCount',  (data) => {
          this.setState({
              userCount: data.userCount
          })
      });
  }

  render() {

    return (
      <div className="container">
        <div className="jumbotron mt-5">
          <div className="col-sm-8 mx-auto">
            <h1 className="text-center">WELCOME</h1>
            <h1 className="text-center">There is { this.state.userCount } player connected</h1>
          </div>
        </div>
      </div>
    )
  }
}

export default Landing