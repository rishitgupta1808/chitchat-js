'use strict';
const passport = require('passport');
const h = require('../helpers');
const config = require('../config');

module.exports = () => {
  const routes = {
    get: {
      '/': (req, res) => {
        res.render('login');
      },
      '/rooms': [h.isAuthenticated, (req, res) => {
        res.render('rooms', {
          user: req.user,
          host: config.host
        });
      }],
      '/chat/:id': [h.isAuthenticated, (req, res, next) => {
        const getRoom = h.findRoomById(req.app.locals.chatrooms, req.params.id);
        if (getRoom === undefined) {
          return next();
        }
        let users = req.session.passport.user; 
        req.app.locals.alluser=users;
        

        
        res.render('chatroom', {
          user: req.user,
          host: config.host,
          room: getRoom.room,
          roomID: getRoom.roomID
        });
      }],
      '/auth/facebook': passport.authenticate('facebook'),
      '/auth/facebook/callback': passport.authenticate('facebook', {
        successRedirect: '/rooms',
        failureRedirect: '/'
      }),
      '/auth/google': passport.authenticate('google',{scope :[ 'email', 'profile' ]}),
      '/auth/google/callback': passport.authenticate('google', {
        successRedirect: '/rooms',
        failureRedirect: '/'
      }),
      '/logout': (req, res) => {
        req.logout();
        res.redirect('/');
      }
    },
    post: {

    },
    NA: (req, res) => {
      res.status(404).sendFile(`${process.cwd()}/views/404.htm`);
    }
  };
  return h.route(routes);
};
