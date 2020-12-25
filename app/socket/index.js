'use strict';
const h = require('../helpers');

module.exports = (io, app,redis) => {
  const allrooms = app.locals.chatrooms;
  

  io.of('/roomslist').on('connection', socket => {
    socket.on('getChatrooms', () => {
      socket.emit('chatRoomsList', JSON.stringify(allrooms));
    });

    socket.on('createNewRoom', newRoomInput => {
      if (!h.findRoomByName(allrooms, newRoomInput)) {
        allrooms.push({
          room: newRoomInput,
          roomID: h.randomHex(),
          users: []
        });
        socket.emit('chatRoomsList', JSON.stringify(allrooms));
        socket.broadcast.emit('chatRoomsList', JSON.stringify(allrooms));
      }
    });
  });

  io.of('/chatter').on('connection', socket => {
    socket.on('join', data => {
      
      const usersList = h.addUserToRoom(allrooms, app.locals.alluser, data, socket);
      
      socket.broadcast.to(data.roomID).emit('updateUserList',JSON.stringify(usersList));
      socket.emit('updateUserList',JSON.stringify(usersList));
    });

    socket.on('disconnect',()=>{
      const room = h.removeUserFromRoom(allrooms,socket);
      socket.broadcast.emit('updateUserList',JSON.stringify(room));
    });

    socket.on('messagein',data=>{
     socket.broadcast.to(data.roomID).emit('messagedis',JSON.stringify(data)); 
    })
  });
};
