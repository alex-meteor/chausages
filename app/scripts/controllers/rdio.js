'use strict';

angular.module('app')
  .controller('RdioController', function ($scope, $http, $window, socket) {
		this.list = [];

		console.log($window);

		/*
		*	handle socket emissions
		*/
		// socket.forward('welcome', $scope);
  });
