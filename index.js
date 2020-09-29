const express = require('express');
const socket = require('socket.io');

const app = express();
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log('listening on request');
});

app.use(express.static('public'));

//storing users at array list
let usersList = [];

const io = socket(server);

io.on('connection', (socket) => {
  io.sockets.emit('count members', usersList);
  socket.on('chat', (data) => {
    io.sockets.emit('chat', data);
  })
  socket.on('join', (data) => {
    io.sockets.emit('join', data);
    io.sockets.emit('count members', usersList);
    console.log(usersList);
  })
  socket.on('new user', (data) => {
    usersList.push(data);
    socket.username = data;
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('left', socket.username);
    usersList = usersList.filter(el => el !== socket.username);
    console.log(usersList);
    io.sockets.emit('count members', usersList);
  })
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  })
})
