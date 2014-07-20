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

			socket.on('queue:add', function(e){
				_this.list.push(new Track(e.track));
			});

			socket.on('queue:list', function(e) {
				_this.load(e.list);
			});
		};

		Queue.prototype.order = function() {
			this.list = _.sortBy(this.list, 'score')
		};

		Queue.prototype.add = function(track) {
			socket.emit('queue:add', track);
		};

		Queue.prototype.load = function(tracks) {
			for(var i =0; i < tracks.length; i++) {
				this.list.push(new Track(tracks[i]));
			}
		};

		return new Queue();
	});
