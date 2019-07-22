const express = require('express');
const games = express.Router();
const cors = require('cors');

const Game = require('../models/Game');

games.use(cors());

games.post('/createGame', (req, res) => {

    const gameData = {
        user_1_id: req.body.user_1_id,
    };

    Game.create(gameData).then((data) => {
        res.json(data);
    });

});

games.post('/getGamesByUserId', (req, res) => {

    const gameData = {
        $and: [
            {
                $or: [
                    {user_1_id: req.body.user_id},
                    {user_2_id: req.body.user_id}
                ]
            },
            {
                finished: true
            }
        ]
    };

    Game.find(gameData).then((gamesRes) => {
        res.json(gamesRes);
    });

});

games.post('/updateGame', (req, res) => {

    const gameData = {
        _id: req.body.id,
    };

    Game.updateOne(gameData, req.body.gameDataUpdate).then((gamesRes) => {
        console.log('game modified');
    }).catch();

});

games.post('/getGameWinById', (req, res) => {

    const gameData = {
        $and: [
            {
                $or: [
                    {user_1_id: req.body.user_id},
                    {user_2_id: req.body.user_id}
                ]
            },
            {
                finished: true
            },
            {
                loser:{ $ne: req.body.user_id }
            }
        ]
    };

    Game.count(gameData).then((gamesRes) => {
        res.json(gamesRes);
    });

});
games.post('/getGameLostById', (req, res) => {

    const gameData = {
        $and: [
            {
                $or: [
                    {user_1_id: req.body.user_id},
                    {user_2_id: req.body.user_id}
                ]
            },
            {
                finished: true
            },
            {
                loser:req.body.user_id
            }
        ]
    };

    Game.count(gameData).then((gamesRes) => {
        res.json(gamesRes);
    });

});
module.exports = games;