'use strict';

angular.module('app')
  .factory('User', function (socket) {
		var schema = {
			_id: (function() {
				function s4() {
					return Math.floor((1 + Math.random()) * 0x10000)
						.toString(16)
						.substring(1);
				}
				return function() {
					return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
						s4() + '-' + s4() + s4() + s4();
				};
			})(),
			name: 'Jae Cha'
		};

		var User = function() {
			var _id = localStorage.getItem('user');
			if(_id) { this._id = _id; }
		}
  });
