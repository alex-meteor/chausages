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
				key: '',
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
	    if(init.albumArtist){
    		this.map(init);
    	} else {
		    angular.extend(this, init);
	    }
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

		Track.prototype.map = function(init) {
			console.log('Track Map', init)
			angular.extend(this, {
				info: {
					key: init.key,
					name: init.name,
					artist: init.artist,
					album: init.album,
					art: init.icon,
					explicit: init.isExplicit,
					duration: init.duration
				}
			});
		};

		Track.prototype.vote = function(userId, value) {
			socket.emit('track:vote', { user_id: userId, _id: this._id, vote: value } );
		};

		Track.prototype.voted = function(userId) {
			return !!(_.find(this.votes, {user_id: userId}));
		};

		Track.prototype.add = function(userId) {
			var add = { user_id: userId, track: this.info };
			socket.emit('queue:add', add);
		};

		return Track;
  });