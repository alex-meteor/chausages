'use strict';

/**
 * @ngdoc service
 * @name chasaugeApp.song
 * @description
 * # song
 * Factory in the chasaugeApp.
 */
angular.module('app')
	.service('Queue', function (Track, socket) {
		var Queue = function() {
			var _this = this;
			this.list = [];
			this.load(mocks.tracks);
			socket.on('queue:list', function(e) {
				_this.load(e.list);
			});
		};

		Queue.prototype.order = function() {
			this.list = _.sortBy(this.list, 'score')
		};

		Queue.prototype.load = function(tracks) {
			angular.copy([], this.list);
			for(var i =0; i < tracks.length; i++) {
				this.list.push(new Track(tracks[i]));
			}
		};

		return new Queue();
	});
