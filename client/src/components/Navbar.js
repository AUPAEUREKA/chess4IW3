import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import socketIOClient from "socket.io-client";

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

  logOut(e) {
    e.preventDefault()
    localStorage.removeItem('usertoken')
    this.props.history.push(`/`)
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
      const playerCountStyle = {
          float: 'right',
          color: 'rgba(255,255,255,.5)'
      };
    const loginRegLink = (
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/login" className="nav-link">
            Login
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/register" className="nav-link">
            Register
          </Link>
        </li>
      </ul>
    )

    const userLink = (
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/room" className="nav-link">
            Room
          </Link>
        </li>
          <li className="nav-item">
          <Link to="/history" className="nav-link">
            Game historic
          </Link>
        </li>
        <li className="nav-item">
          <a href="/" onClick={this.logOut.bind(this)} className="nav-link">
            Logout
          </a>
        </li>
      </ul>
    )

    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark rounded">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarsExample10"
          aria-controls="navbarsExample10"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
          className="collapse navbar-collapse justify-content-md-center"
          id="navbarsExample10"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
          </ul>
          {localStorage.usertoken ? userLink : loginRegLink}
        </div>
        <div style={playerCountStyle}>
            Player { this.state.userCount }
        </div>
      </nav>
    )
  }
}

export default withRouter(Landing)