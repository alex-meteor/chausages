'use strict';

var api = require('./controllers/api'),
    index = require('./controllers'),
    users = require('./controllers/users'),
    session = require('./controllers/session'),
    qrCode = require('./controllers/qrCode'),
    server = require('./controllers/server'),
    middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app, socket) {

  app.route('/server')
    .get(server.index);

//route for QR Code generation
  app.route('/api/qrCode/:url')
    .get(qrCode.generate);

  app.route('/api/users')
    .post(users.create)
    .put(users.changePassword);
  app.route('/api/users/me')
    .get(users.me);
  app.route('/api/users/:id')
    .get(users.show);

  app.route('/api/session')
    .post(session.login)
    .delete(session.logout);

  // All undefined api routes should return a 404
  app.route('/api/*')
    .get(function(req, res) {
      res.send(404);
    });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*')
    .get(index.partials);
  app.route('/*')
    .get( middleware.setUserCookie, index.index);
};