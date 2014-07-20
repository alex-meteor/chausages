'use strict';

angular.module('app')
  .service('User', function (socket) {
		var uuid = (function() {
			function s4() {
				return Math.floor((1 + Math.random()) * 0x10000)
					.toString(16)
					.substring(1);
			}

			return function() {
				return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
					s4() + '-' + s4() + s4() + s4();
			};

		})();

		var User = function() {
			var _this = this;
			this._id = localStorage.getItem('user') || uuid;

			socket.emit('user:get', { _id: _this._id });
			socket.on('user:profile', function(e) {
				angular.extend(_this, e.user);
				localStorage.user = _this._id;
			});
		};

		User.prototype.register = function(name, password) {
			socket.emit('user:register', { _id: _this._id, name: name, password: password });
			angular.extend(this, { name: name });
		};

		return new User();
  });
