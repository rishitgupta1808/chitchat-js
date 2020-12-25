'use strict';
const router = require('express').Router();
const crypto = require('crypto');

const db = require('../db');

const _registerRoutes = (routes, method) => {
  /* eslint-disable no-restricted-syntax */
  for (const key in routes) {
    if (typeof routes[key] === 'object' &&
        routes[key] !== null &&
        !(routes[key] instanceof Array)) {
      _registerRoutes(routes[key], key);
    } else {
      if (method === 'get') {
        router.get(key, routes[key]);
      } else if (method === 'post') {
        router.post(key, routes[key]);
      } else {
        router.use(routes[key]);
      }
      console.log('register', key);
    }
  }
  /* eslint-enable no-restricted-syntax */
};

const route = routes => {
  _registerRoutes(routes);
  return router;
};

const findOne = profileID => {
  return db.userModel.findOne({
    profileId: profileID
  });
};

const createNewUser = profile => {
  return new Promise((resolve, reject) => {
    const newChatUser = new db.userModel({
      profileId: profile.id,
      fullName: profile.displayName,
      profilePic: profile.photos[0].value || ''
    });

    newChatUser.save(error => {
      if (error) {
        reject(error);
      } else {
        resolve(newChatUser);
      }
    });
  });
};

const findById = id => {
  return new Promise((resolve, reject) => {
    db.userModel.findById(id, (error, user) => {
      if (error) {
        reject(error);
      } else {
        resolve(user);
      }
    });
  });
};

const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};

const findRoomByName = (allrooms, room) => {
  const findRoom = allrooms.findIndex((element) => {
    return element.room === room;
  });
  return findRoom > -1;
};

const randomHex = () => {
  return crypto.randomBytes(24).toString('hex');
};

const findRoomById = (allrooms, roomID) => {
  return allrooms.find((element) => {
    return element.roomID === roomID;
  });
};

const addUserToRoom = (allrooms, allusers, data, socket) => {
  const getRoom = findRoomById(allrooms, data.roomID);
  if (getRoom !== undefined) {
    const userID = allusers;
    const checkUser = getRoom.users.findIndex((element) => {
      return element.userID === userID;
    });

    if (checkUser > -1) {
      getRoom.users.splice(checkUser, 1);
    }
    getRoom.users.push({
      socketID: socket.id,
      userID,
      user: data.user,
      userPic: data.userPic
    });
    socket.join(data.roomID);
    return getRoom;
  }
};

let removeUserFromRoom = (allrooms,socket) =>{
  for (let room of allrooms) {

    let removeUser = room.users.findIndex((element)=>{
      return socket.id === element.socketID;
    })

    if(removeUser>-1){
      socket.leave(room.roomID);
      room.users.splice(removeUser,1);
      socket.broadcast.to(room.roomID);
      return room;
    }


  
  }
}



module.exports = {
  route,
  findOne,
  createNewUser,
  findById,
  isAuthenticated,
  findRoomByName,
  findRoomById,
  addUserToRoom,
  removeUserFromRoom,

  randomHex
};
