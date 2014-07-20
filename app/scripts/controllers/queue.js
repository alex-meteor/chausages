'use strict';

angular.module('app')
  .controller('QueueController', function ($scope, $http, Track, socket) {
		var _this = this;
		_this.list = [];

		//-- START MOCKS --//
		for(var i = 0; i < mocks.tracks.length; i++) { mocks.tracks[i] = new Track(mocks.tracks[i]); }
		_this.list = mocks.tracks;
		_this.playing = this.list.pop();
		//-- END MOCKS --//

		/*
		*	handle socket emissions
		*/
		socket.forward('welcome', $scope);
		socket.forward('update:queue', $scope);
		$scope.$on('socket:welcome', function (env, data) {
			socket.emit('queue:add', { song: 'Dr. Carter' });
		});
		$scope.$on('queue:add', function (env, data){
			_this.list.push(new Track(data));
		});
  });
