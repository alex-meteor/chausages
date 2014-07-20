'use strict';

angular.module('app')
	.controller('AppController', function (User) {
		var _this = this;
		_this.user = User;
		/*
		 *	handle socket emissions
		 */
		socket.on('welcome', function(e) {
			console.log(e.msg);
		});
	});