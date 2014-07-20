'use strict';

angular.module('app')
	.controller('AppController', function (User, socket, Queue) {
		var _this = this;
		_this.user = User;

		socket.on('welcome', function(e) {
			console.log(e.msg);
			socket.emit('get:list');
		});

		socket.on('load:queue', function(e){
			console.log(e);
			Queue.load(e.list);
		});
	});