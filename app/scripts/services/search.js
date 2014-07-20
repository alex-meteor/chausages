'use strict';

/**
 * @ngdoc service
 * @name chasaugeApp.song
 * @description
 * # song
 * Factory in the chasaugeApp.
 */
angular.module('app')
	.service('Search', function (Track, socket) {
		var Search = function() {
			var _this = this;
			this.list = [];
			this.query = ""; 
			// this.load(mocks.tracks);
			socket.on('service:rdio:search:results', function(e) {
				_this.load(e.results);
			});
		};

		Search.prototype.search = function(){
			socket.emit('service:rdio:search', {query: this.query});
		};

		Search.prototype.load = function(tracks) {
			angular.copy([], this.list);
			for(var i =0; i < tracks.length; i++) {
				this.list.push(new Track(tracks[i]));
			}
			console.log(this.list);
		};

		return new Search();
	});
