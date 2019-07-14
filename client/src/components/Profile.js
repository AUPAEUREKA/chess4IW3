import React, { Component } from 'react'
import jwt_decode from 'jwt-decode'
import WithMoveValidation from "./HumanVsHuman";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      pseudo: '',
      errors: {}
    }
  }

  componentDidMount() {
    const token = localStorage.usertoken
    const decoded = jwt_decode(token)
    this.setState({
      pseudo: decoded.pseudo
    })
  }

  render() {
    return (
      <div className="container">
        <div className="jumbotron mt-5">
          <div className="col-sm-8 mx-auto">
            <h1 className="text-center">PROFILE</h1>
          </div>
          <table className="table col-md-6 mx-auto">
            <tbody>
              <tr>
                <td>Pseudo</td>
                <td>{this.state.pseudo}</td>
              </tr>
            <tr>

            </tr>
            </tbody>
          </table>
            <div style={boardsContainer}>
                <WithMoveValidation />
            </div>
        </div>
      </div>
    )
  }
}

export default Profile

const boardsContainer = {
    display: "block",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
    marginTop: 30,
    marginBottom: 50
};
