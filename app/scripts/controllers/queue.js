'use strict';

angular.module('app')
  .controller('QueueController', function ($scope, $http, Queue, socket) {
		var _this = this;
		_this.list = Queue.list;

		//-- START MOCKS --//
		Queue.load(mocks.tracks);
		_this.playing = this.list.pop();
		//-- END MOCKS --//

		/*
		*	handle socket emissions
		*/
		socket.on('welcome', function(e) {
			console.log(e.msg);
		});
  });
