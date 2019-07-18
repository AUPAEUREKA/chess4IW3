
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const GameSchema = new Schema({
    user_1_id:  {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    user_2_id:  {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    finished: {
        type: Boolean,
        default: false
    },
    loser: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('games', GameSchema);