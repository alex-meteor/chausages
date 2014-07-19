'use strict';

angular.module('chasaugeApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
  });
