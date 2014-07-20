'use strict';

angular.module('app')
  .controller('QueueController', function ($rootScope, $scope, $http, Queue, socket) {
		var _this = this;
		_this.list = Queue.list;

		console.log(_this.list);
		// //-- START MOCKS --//
		// Queue.load(mocks.tracks);
		// _this.playing = this.list.pop();
		// //-- END MOCKS --//
  });
