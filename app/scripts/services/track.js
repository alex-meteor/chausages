'use strict';

/**
 * @ngdoc service
 * @name chasaugeApp.song
 * @description
 * # song
 * Factory in the chasaugeApp.
 */
angular.module('app')
  .factory('Track', function (socket) {
		var schema = {
			_id: 99,
			name: 'Unknown',
			album: 'Unknown',
			art: 'http://placehold.it/150x150',
			votes: []
		};

    var Track = function(init) {
			angular.extend(this, init);
	    _.defaults(this, schema);
    };

		Track.prototype.score = function() {
			var i = 0, score = 0;
			for(i; i < this.votes.length; i++) {
				this.votes[i].vote ? score++ : score--;
			}
		};

		Track.prototype.vote = function(value) {
			this.voted = true;
			socket.emit('queue:vote', {_id: this._id, value: value} );
		};

    // Public API here
		return Track;
  });
