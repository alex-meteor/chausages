'use strict';

angular.module('app')
  .controller('QueueController', function ($rootScope, $scope, $http, Queue, socket) {
		var _this = this;
		_this.list = Queue.list;

		_this.playing = this.list.pop();

		console.log(_this.list);

		socket.forward('update:playing', $scope);
		$scope.$on('socket:update:playing', function(data){
			console.log(data);
		})
		// //-- START MOCKS --//
		// Queue.load(mocks.tracks);
		// _this.playing = this.list.pop();
		// //-- END MOCKS --//
  });