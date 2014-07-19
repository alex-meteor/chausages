'use strict';

angular.module('app')
  .controller('QueueController', function ($scope, $http, socket) {
		this.list = [ {
			art: 'http://placehold.it/150x150',
			name: 'Song Name',
			user: { name: 'Jae Cha' },
			votes: [
				{vote: true}, {vote: true}, {vote: true}, {vote: true}, {vote: false}
			],
			voted: true
		},
		{
			art: 'http://placehold.it/150x150',
			name: 'Song Name',
			user: { name: 'Jae Cha' },
			voted: false
		},
		{
			art: 'http://placehold.it/150x150',
			name: 'Song Name',
			user: { name: 'Jae Cha' },
			voted: false
		},
		{
			art: 'http://placehold.it/150x150',
			name: 'Song Name',
			user: { name: 'Jae Cha' },
			voted: false
		},
		{
			art: 'http://placehold.it/150x150',
			name: 'Song Name',
			user: { name: 'Jae Cha' },
			voted: false
		}

	];

		this.playing = {
			art: 'http://placehold.it/150x150',
			name: 'Song Name',
			user: { name: 'Jae Cha' }
		};

		this.vote = function(_id, value) {
			socket.emit('socket:vote', {_id: _id, value: value} );
		};
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
