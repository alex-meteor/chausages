'use strict';

angular.module('app')
  .controller('QueueController', function ($scope, $http, socket) {
		this.list = [];


		/*
		*	handle socket emissions
		*/
		socket.forward('welcome', $scope);
		socket.forward('update:queue', $scope);
		$scope.$on('socket:welcome', function (env, data) {
			console.log(data.msg);
			socket.emit('queue:add', { song: 'Dr. Carter' });
		});
		$scope.$on('socket:update:queue', function (env, data){
			console.log(data.song);
		});
  });
