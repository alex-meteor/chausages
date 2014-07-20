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
			this.votes = [];
			socket.on('queue:list', function(e) {
				_this.load(e.list);
			});

			socket.on('queue:update', function(e) {
				console.log('E', e)
				// _this.load(e.list);
				console.log('this is the update ------------',e);
				_this.load(e.list);
				_this.playing = e.playing
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
