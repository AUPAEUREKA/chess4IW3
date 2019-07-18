import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Landing from './components/Landing'
import Login from './components/Login'
import Register from './components/Register'
import Room from './components/Room'
import History from "./components/History";
import WithMoveValidation from "./components/HumanVsHuman";


class App extends Component {
  render() {
    return (
            <Router location={this.props.location}>
                <div className="App">
                    <Navbar />
                    <Route exact path="/" component={Landing} />
                    <div className="container">
                        <Route exact path="/register" component={Register} />
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/room" component={Room} />
                        <Route exact path="/history" component={History} />
                        <Route exact path="/game/:id" component={WithMoveValidation} />
                    </div>
                </div>
            </Router>
    )
  }
}

export default App