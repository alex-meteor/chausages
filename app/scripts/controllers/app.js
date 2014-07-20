'use strict';

angular.module('app')
	.controller('AppController', function (User, socket) {
		var _this = this;
		_this.user = User;

		socket.on('welcome', function(e) {
			console.log(e.msg);
		});
	});