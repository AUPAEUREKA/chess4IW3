const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 5000 ;


app.use(bodyParser.json());
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

const mongoURI = 'mongodb://localhost:27017/mernchess'

mongoose
  .connect(
    mongoURI,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const Users = require('./routes/Users');

app.use('/users', Users);

app.listen(port, function() {
  console.log('Server is running on port: ' + port)
});

server.listen(4200);
let userCount = 0;

io.on('connection', function (socket) {
    userCount++;
    io.emit('userCount', { userCount: userCount });
    socket.on('disconnect', function () {
        userCount--;
        io.emit('userCount', { userCount: userCount });
    });

    socket.on('pieceMoved', function (fen) {
        io.emit('pieceMoved', fen);
    });
});