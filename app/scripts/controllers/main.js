'use strict';

angular.module('chasaugeApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
	$http.get('/api/awesomeThings').success(function(awesomeThings) {
	  $scope.awesomeThings = awesomeThings;
	});

	/*
	*	handle socket emissions
	*/
	socket.forward('welcome', $scope);
	$scope.$on('socket:welcome', function (env, data) {
		console.log(data.msg);
	});

});
