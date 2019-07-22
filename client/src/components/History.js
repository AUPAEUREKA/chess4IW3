import React, { Component } from 'react'
import {getGamesByUserId, getGameLostById, getGameWinById} from './GameFunctions'
import jwt_decode from "jwt-decode";

class History extends Component {
    constructor() {
        super();
        this.state = {
            user: {},
            games: [],
            countGameLost: 0,
            countGameWin: 0
        }
    }

    componentDidMount() {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        this.setState({
            user: decoded
        });

        const gameData = {
            user_id: decoded._id
        };
        getGamesByUserId(gameData).then(res => {
            this.setState({
                games: res
            });
        });

        getGameLostById(gameData).then(res => {
            this.setState({
                countGameLost: res
            });
        });
        getGameWinById(gameData).then(res => {
            this.setState({
                countGameWin: res
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
                <td>Jouer le {cdate}</td>
                <td>game {winOrLose}</td>
            </tr>;
        });

        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">Historique des parties</h1>
                    </div>
                    <table className="table col-md-6 mx-auto">
                        <tbody>
                        {gameList}
                        </tbody>
                    </table>
                    <div>
                        {this.state.countGameLost} {this.state.countGameLost > 1 ? 'parties perdues': 'partie perdu'} <br></br>
                        {this.state.countGameWin} {this.state.countGameWin > 1 ? 'parties gagnées': 'partie gagnée'}
                    </div>
                </div>
            </div>
        )
    }
}

export default History

