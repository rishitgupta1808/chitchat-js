'use strict';
/* eslint-disable global-require */
/* eslint-disable no-param-reassign */

const config = require('./config');
const redis = require('redis').createClient;
const adapter = require('socket.io-redis');
require('./auth')();

const ioServer = app => {
  app.locals.chatrooms = [];
  app.locals.alluser = 0;
  const server = require('http').Server(app);
  const io = require('socket.io')(server);
  io.use('transports',['websocket']);
  let pubClient = redis(config.redis.port,config.redis.host,{
     auth_pass : config.redis.pass
  });

  let subClient =  redis(config.redis.port,config.redis.host,{
     return_buffer : true,
     auth_pass : config.redis.pass
  });

  io.adapter(adapter({
    pubClient,
    subClient
  }))


  io.use((socket, next) => {
    require('./session')(socket.request, {}, next);
  });

  require('./socket')(io, app);

  return server;
};


module.exports = {
  router: require('./routes')(),
  session: require('./session'),
  ioServer,

};
