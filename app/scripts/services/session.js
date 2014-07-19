'use strict';

angular.module('chasaugeApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
