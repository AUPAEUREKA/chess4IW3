import React, { Component } from 'react'
import socketIOClient from "socket.io-client";
import jwt_decode from "jwt-decode";

class Room extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            pseudo: '',
            socket: socketIOClient("localhost:4200"),
            rooms: []
        };

        this.onClickCreateRoom = this.onClickCreateRoom.bind(this);
        this.lauchGame = this.lauchGame.bind(this);
        this.getRoomList();
        this.lauchGame();

    }



    componentDidMount() {
        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        this.setState({
            pseudo: decoded.pseudo
        })

    }

    getRoomList() {
        this.state.socket.emit('getRooms', '');

        this.state.socket.on('getRooms',(rooms) => {
            this.setState({
                rooms: rooms
            });
        })
    }
    lauchGame() {

        this.state.socket.on('launchGame',(roomName) => {
            this.props.history.push('/game/' + roomName.split('-')[1]);
        });

        this.state.socket.on('newGame',(data) => {
            this.setState({
                name: data.room,
                rooms: data.rooms
            })
        });
    }

    onClickCreateRoom() {
        this.state.socket.emit('createGame', {name: this.state.pseudo});
    }

    onClickEnterGame(room,cpa) {
        this.state.socket.emit('joinGame', {name: this.state.pseudo, room: room});
    }

    render() {

        const namesList = this.state.rooms.map((room) => {
            return <tr>
                <td>name</td>
                <td>{room}</td>
                <td><button onClick={this.onClickEnterGame.bind(this,room)}>Entrez dans la room</button></td>
            </tr>;
        });

        return (
            <div className="container">
                <div className="jumbotron mt-5">
                    <div className="col-sm-8 mx-auto">
                        <h1 className="text-center">Les Rooms</h1>
                    </div>
                    <table className="table col-md-6 mx-auto">
                        <tbody>
                        {namesList}
                        </tbody>
                    </table>
                </div>
                <div>
                    <button onClick={this.onClickCreateRoom}>Creer room </button>
                </div>
            </div>
        )
    }
}

export default Room

