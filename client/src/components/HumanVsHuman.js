import React, { Component } from "react";
import PropTypes from "prop-types";
import Chessboard from "chessboardjsx";
import socketIOClient from "socket.io-client";
import { createGame, updateGame } from './GameFunctions'
import jwt_decode from "jwt-decode";

const Chess = require('chess.js');


class HumanVsHuman extends Component {
    static propTypes = { children: PropTypes.func };

    constructor() {
        super();
        this.socketOnPiecedMoved = this.socketOnPiecedMoved.bind(this)
        this.socketOnPiecedMoved();
    }
    state = {
        user: {},
        fen: "start",
        // square styles for active drop square
        dropSquareStyle: {},
        // custom square styles
        squareStyles: {},
        // square with the currently clicked piece
        pieceSquare: "",
        // currently clicked square
        square: "",
        // array of past game moves
        history: [],
        game_over: false,
        game:'',
        gameIdMongo:'',
        socket: socketIOClient("localhost:4200"),
        myTurn: true
    };

    componentDidMount() {
        this.game = new Chess();

        const token = localStorage.usertoken;
        const decoded = jwt_decode(token);
        this.setState({
            user: decoded
        });

        this.setState(() => ({
            game: window.location.pathname.split('/')[2]
        }));
        this.state.socket.emit('joinRoom','room-' + window.location.pathname.split('/')[2]);

    }

    socketOnPiecedMoved() {
        this.state.socket.on('pieceMovedEmit',  (data) => {

            if (this.state.gameIdMongo === '' && data.gameIdMongo === '') {
                const gameData = {
                    user_1_id: this.state.user._id
                };

                createGame(gameData).then(res => {
                    this.setState({
                        gameIdMongo: res.data._id
                    });
                });
            } else if (this.state.gameIdMongo === '') {
                const gameData = {
                    id: data.gameIdMongo,
                    gameDataUpdate : {
                        $set: { user_2_id: this.state.user._id, }
                    }
                };
                updateGame(gameData).then(res => {
                    console.log('second user added')
                });
            }

            this.setState({
                fen: data.fen,
                history: data.history,
                gameIdMongo: data.gameIdMongo,
                pieceSquare: "",
                game_over: data.game_over,
                myTurn: true
            });

            this.game.move({
                from: data.from,
                to: data.to,
                promotion: "q"
            });

            this.updateHistoryIfCheckmate();
        });
    }

    // keep clicked square style and remove hint squares
    removeHighlightSquare = () => {
        this.setState(({ pieceSquare, history }) => ({
            squareStyles: squareStyling({ pieceSquare, history })
        }));
    };

    updateHistoryIfCheckmate() {
        if (this.game.in_checkmate()) {
            const gameData = {
                id: this.state.gameIdMongo,
                gameDataUpdate : {
                    $set: { finished: true, loser: this.state.user._id }
                }
            };
            updateGame(gameData).then(res => {
                console.log('You are checkmate')
            });
        }
    }

    // show possible moves
    highlightSquare = (sourceSquare, squaresToHighlight) => {
        const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
            (a, c) => {
                return {
                    ...a,
                    ...{
                        [c]: {
                            background:
                                "radial-gradient(circle, #fffc00 36%, transparent 40%)",
                            borderRadius: "50%"
                        }
                    },
                    ...squareStyling({
                        history: this.state.history,
                        pieceSquare: this.state.pieceSquare
                    })
                };
            },
            {}
        );

        this.setState(({ squareStyles }) => ({
            squareStyles: { ...squareStyles, ...highlightStyles }
        }));
    };

    onDrop = ({ sourceSquare, targetSquare }) => {
        // see if the move is legal
        let move = this.game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q" // always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return;
        this.setState(({ history, pieceSquare }) => ({
            fen: this.game.fen(),
            history: this.game.history({ verbose: true }),
            squareStyles: squareStyling({ pieceSquare, history })
        }));

    };

    onMouseOverSquare = square => {
        // get list of possible moves for this square
        let moves = this.game.moves({
            square: square,
            verbose: true
        });

        // exit if there are no moves available for this square
        if (moves.length === 0) return;

        let squaresToHighlight = [];
        for (var i = 0; i < moves.length; i++) {
            squaresToHighlight.push(moves[i].to);
        }

        this.highlightSquare(square, squaresToHighlight);
    };

    onMouseOutSquare = square => this.removeHighlightSquare(square);

    // central squares get diff dropSquareStyles
    onDragOverSquare = square => {
        this.setState({
            dropSquareStyle:
                square === "e4" || square === "d4" || square === "e5" || square === "d5"
                    ? { backgroundColor: "cornFlowerBlue" }
                    : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" }
        });
    };

    onSquareClick = square => {

        if (!this.state.myTurn) return;

        this.setState(({ history }) => ({
            squareStyles: squareStyling({ pieceSquare: square, history }),
            pieceSquare: square
        }));

        let move = this.game.move({
            from: this.state.pieceSquare,
            to: square,
            promotion: "q" // always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return;

        this.setState({
            fen: this.game.fen(),
            history: this.game.history({ verbose: true }),
            pieceSquare: "",
            myTurn: false
        });

        this.state.socket.emit('pieceMoved', {
            from: this.state.pieceSquare,
            to: square,
            gameId: this.state.game,
            gameIdMongo: this.state.gameIdMongo,
            fen: this.game.fen(),
            history: this.game.history({ verbose: true }),
            game_over: this.game.game_over(),
        });
    };

    onSquareRightClick = square =>
        this.setState({
            squareStyles: { [square]: { backgroundColor: "deepPink" } }
        });

    render() {
        const { fen, dropSquareStyle, squareStyles } = this.state;
        return this.props.children({
            squareStyles,
            position: fen,
            onMouseOverSquare: this.onMouseOverSquare,
            onMouseOutSquare: this.onMouseOutSquare,
            onDrop: this.onDrop,
            dropSquareStyle,
            onDragOverSquare: this.onDragOverSquare,
            onSquareClick: this.onSquareClick,
            onSquareRightClick: this.onSquareRightClick
        });
    }
}

export default function WithMoveValidation() {
    return (
        <div>
            <HumanVsHuman>
                {({
                      position,
                      onDrop,
                      onMouseOverSquare,
                      onMouseOutSquare,
                      squareStyles,
                      dropSquareStyle,
                      onDragOverSquare,
                      onSquareClick,
                      onSquareRightClick
                  }) => (
                    <Chessboard
                        id="humanVsHuman"
                        width={1000}
                        position={position}
                        onDrop={onDrop}
                        onMouseOverSquare={onMouseOverSquare}
                        onMouseOutSquare={onMouseOutSquare}
                        boardStyle={{
                            borderRadius: "5px",
                            boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
                        }}
                        squareStyles={squareStyles}
                        dropSquareStyle={dropSquareStyle}
                        onDragOverSquare={onDragOverSquare}
                        onSquareClick={onSquareClick}
                        onSquareRightClick={onSquareRightClick}
                    />
                )}
            </HumanVsHuman>
        </div>
    );
}

const squareStyling = ({ pieceSquare, history }) => {
    const sourceSquare = history.length && history[history.length - 1].from;
    const targetSquare = history.length && history[history.length - 1].to;

    return {
        [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
        ...(history.length && {
            [sourceSquare]: {
                backgroundColor: "rgba(255, 255, 0, 0.4)"
            }
        }),
        ...(history.length && {
            [targetSquare]: {
                backgroundColor: "rgba(255, 255, 0, 0.4)"
            }
        })
    };
};
