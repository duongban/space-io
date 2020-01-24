const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const socketio = require('socket.io');

// Setup an Express server
const app = express();
app.use(express.static('public'));

// Listen on port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = socketio(server);

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);

  socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
  socket.on(Constants.MSG_TYPES.INPUT, handleInput);
  socket.on(Constants.MSG_TYPES.MOUSEPOS, handleMousePos);
  socket.on(Constants.MSG_TYPES.INPUT_MOUSE_LEFT_CLICK, handleMouseLeftClick);
  socket.on('disconnect', onDisconnect);
});
