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
			info: {
				name: 'Unknown',
				artist: 'Unknown',
				art: 'http://placehold.it/150x150',
				comments: [],
				user: {
					name: 'Jae Cha'
				}
			},
			votes: []
		};

    var Track = function(init) {
			angular.extend(this, init);
	    _.defaults(this, schema);

	    socket.on('track:update', function(e) {
		    if(e.track._id === this._id) {
			    angular.extend(this, e.track);
		    }
	    });
    };

		Track.prototype.score = function() {
			var i = 0, score = 0;
			for(i; i < this.votes.length; i++) {
				this.votes[i].vote ? score++ : score--;
			}
		};

		Track.prototype.vote = function(value) {
			this.voted = true;
			socket.emit('track:vote', {_id: this._id, value: value} );
		};

		Track.prototype.voted = function(userId) {
			return !!(_.find(this.votes, {user_id: userId}));
		};

    // Public API here
		return Track;
  });
