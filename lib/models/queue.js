'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

mongoose.set('debug', true);

/**
 * Song Queue Schema
 */
var QueueSchema = new Schema({
	info: {type: String, ref: 'Track'}, //the object id of the song in Rdio
	added: Date,                            //the timestamp of when the song was added to the queue
	user: {type: String, ref: 'User'},      //the object id of the user that requested the song
	votes: [
			{
				user_id: String, //The object id of the user that voted on the song
				vote: Boolean,   //The vote itself (false - downvote, true - upvote)
				voted: Date,     //Timestamp of when vote was registered
				_id: false       //We don't need _ids added to our subdocuments
			}
		],
	comments: [
		{
			user_id: String,  //The user that made the comment
			comment: String,  //The comment text
			added: Date,      //when the comment was posted
			_id: false,       //We don't need _ids added to our subdocuments
			votes: [
				{
					user_id: String, //The object id of the user that voted on the comment
					vote: Boolean,   //The vote itself (false - downvote, true - upvote)
					voted: Date,     //Timestamp of when vote was registered
					_id: false,      //We don't need _ids added to our subdocuments
				}
			]
		}
	]
});

/**
 * Track Schema
 */
var TrackSchema = new Schema({
	name: String,        //the name of the song
	added: Date,         //the timestamp of when the song was added to the system
	artist: String,      //the artist performing the song
	album: String,       //the name of the album that the track appears on 
	duration: Number,    //the duration of the track in seconds
	explicit: Boolean,   //is the track explicit?
	art: String,         //the URL of the album-art for the track
	history: [
			{
				user_id: String,  //The object id of the user that voted on the song
				played: Date,     //Timestamp of when the song was played (if ever)
				requested: Date,  //Timestamp of when vote was registered
				votes: [{
						'up': Boolean,
						'down': Boolean
					}
				]
			}
		]
});

/**
 * Methods
 */
QueueSchema.methods = {
	/**
	 * Add - add a track to the queue
	 * @param {String} user
	 * @param {String} track
	 * @return {Boolean}
	 * @api public
	 */
	add: function(info, socket) {
		var Queue = mongoose.model('Queue');
    var queue = new Queue();

    queue.info     = info.track_id;
		queue.added    = Date.now();
		queue.user     = info.user_id;
		queue.votes    = [];
		queue.comments = [];
    queue.save(function(err, doc) {
      //handle error
      if (err) {
        console.log("ERROR: " + err);
      }
      return doc;
    });
	},

	/**
	 * Vote - allow a user to vote on a track in the queue
	 *
	 * @param {Object} info
	 * @return {Boolean}
	 * @api public
	 */
	vote: function(info, socket) {
		this.model('Queue').findOne({'_id': info._id})
		.populate('info')
		.populate('user')
		.exec (function(err, doc) {
			if (doc) {
				doc.votes.push({
					'user': info.user_id,
					'vote': info.vote,
					'voted': Date.now()
				});

				doc.save(function(err, doc) {
					socket.emit('track:update', {'track': doc});
				});
				console.log(doc);
			}
			else {
				console.log("ERROR: " + err);
			}
		});
	}

	/**
	 * Commnent - allow a uesr to vote on a comment in the queue
	 *
	 * @param {String} user
	 * @param {Boolean} vote
	 * @return {Boolean}
	 * @api public

	vote: function(user, vote) {
		this.votes.push({
				'user_id': user,
				'vote': vote,
				'voted': Date.now()
			}
		)
	},   */


};

TrackSchema.methods = {
	/**
	 * Add - add a track to the collection
	 * @param {String} user
	 * @param {String} track
	 * @return {Boolean}
	 * @api public
	 */
	add: function(info) {
		var Track = mongoose.model('Track');
    var track = new Track();

		track._id       = info.key;
		track.added     = Date.now();
		track.user_id   = info.user_id;
		track.artist    = info.artist;
		track.album     = info.album;
		track.duration  = info.duration;
		track.explicit  = info.isExplicit;
		track.album_art = info.icon;

		track.save(function(err, doc) {
      //handle error
      if (err) {
        console.log("ERROR: " + err);
      }
      return doc;
    });
	}
};

/**
 * Validations

QueueSchema.path('awesomeness').validate(function (num) {
	return num >= 1 && num <= 10;
}, 'Awesomeness must be between 1 and 10');
*/

module.exports = mongoose.model('Queue', QueueSchema);
var Track = mongoose.model('Track', TrackSchema);
//var User  = mongoose.model('User');