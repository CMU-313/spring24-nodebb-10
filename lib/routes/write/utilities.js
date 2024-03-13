'use strict';

const router = require('express').Router();
const middleware = require('../../middleware');
const controllers = require('../../controllers');
const routeHelpers = require('../helpers');
const {
  setupApiRoute
} = routeHelpers;
module.exports = function () {
  const middlewares = middleware.checkRequired.bind(null, ['username', 'password']);
  setupApiRoute(router, 'post', '/login', [middlewares], controllers.write.utilities.login);
  return router;
};