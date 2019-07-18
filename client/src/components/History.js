import React, { Component } from 'react'
import {getGamesByUserId} from './GameFunctions'
import jwt_decode from "jwt-decode";

class History extends Component {
    constructor() {
        super();
        this.state = {
            user: {},
            games: []
        }
    }

    componentDidMount() {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        this.setState({
            user:decoded
        });

        const gameData = {
            user_id: decoded._id
        };
        getGamesByUserId(gameData).then(res => {
            this.setState({
               games:res
            });
        });

    }

    render() {

        const gameList = this.state.games.map((game,i) => {
            let winOrLose  = '';
            if (game.loser === this.state.user._id) {
                 winOrLose = "lost";
            } else {
                 winOrLose = "won";
            }
            const cdate = (new Date(game.date)).toLocaleDateString();

            return <tr key={i}>
                <td>Played the {cdate}</td>
                <td>game {winOrLose}</td>
            </tr>;
        });

        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">My game history</h1>
                    </div>
                    <table className="table col-md-6 mx-auto">
                        <tbody>
                        {gameList}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default History

