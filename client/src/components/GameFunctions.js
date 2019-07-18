import axios from "axios";

export const createGame = newGame => {
    return axios
        .post('/games/createGame', {
            user_1_id: newGame.user_1_id,
        })
        .then(response => {
            return response;
        })
}

export const updateGame = game => {
    console.log(game);
    return axios
        .post('/games/updateGame', {
            id: game.id,
            gameDataUpdate : game.gameDataUpdate
        })
        .then(response => {
            console.log('second user added')
        }).catch();
}

export const getGamesByUserId = data => {
    return axios
        .post('/games/getGamesByUserId', {
            user_id: data.user_id,
        })
        .then(response => {
            return response.data;
        })
}