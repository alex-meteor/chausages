'use strict';

var mongoose = require('mongoose'),
		Schema = mongoose.Schema;
/**
 * Song Queue Schema
 */
var QueueSchema = new Schema({
	info: {type: String, ref: 'Track'},     //the object id of the song in Rdio
	added: Date,                            //the timestamp of when the song was added to the queue
	user: {type: String, ref: 'User'},      //the object id of the user that requested the song
	votes: [
			{
				user: String, //The object id of the user that voted on the song
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
					user: String, //The object id of the user that voted on the comment
					vote: Boolean,   //The vote itself (false - downvote, true - upvote)
					voted: Date,     //Timestamp of when vote was registered
					_id: false      //We don't need _ids added to our subdocuments
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
	key: String,         //the rdio key
	added: Date,         //the timestamp of when the song was added to the system
	artist: String,      //the artist performing the song
	album: String,       //the name of the album that the track appears on 
	duration: Number,    //the duration of the track in seconds
	explicit: Boolean,   //is the track explicit?
	art: String,         //the URL of the album-art for the track
	history: [
			{
				user_id: String,  //The user that requested the song
				played: Date,     //Timestamp of when the song was played (if ever)
				requested: Date,  //Timestamp of when the song was requested
				votes: [{         //total votes 
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

		//client will send in the track key - see if we have it in the tracks collection
		var Track = mongoose.model('Track');
		var track = new Track();
		Track.findOne({'key': info.track.key}, function(err, doc) {
			if (!doc) {
				track.add(info, function(xdoc) {
					queue.info     = xdoc._id;
					queue.added    = Date.now();
					queue.user     = info.user_id;
					queue.votes    = [];
					queue.comments = [];
					queue.save(function(err, doc) {
						//handle error
						if (err) {
						}
						Queue.find()
						.populate('info')
						.exec (function(err, docs) {
							socket.emit('queue:update', {'list': docs});
						});
					});
				});
			}
			else {
				queue.info     = doc._id;
				queue.added    = Date.now();
				queue.user     = info.user_id;
				queue.votes    = [];
				queue.comments = [];
				queue.save(function(err, doc) {
					//handle error
					if (err) {
					}
					
					Queue.find()
						.populate('info')
						.exec (function(err, docs) {
							socket.emit('queue:update', {'list': docs});
						});
				});
			}
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

		var _this = this;
		_this.model('Queue').findOne({'_id': info._id})
		.populate('info')
		.populate('user')
		.exec (function(err, doc) {
			if (doc) {
				console.log('INFO----------', info);
				doc.votes.push({
					'user': info.user_id,
					'vote': info.vote,
					'voted': Date.now()
				});

				doc.save(function(err, doc) {
					_this.model('Queue').find()
						.populate('info')
						.exec(function(err, docs) {
						socket.emit('queue:update', { 'list': docs });
					});
				});
			}
			else {
			}
		});
	}
};

TrackSchema.methods = {
	/**
	 * Add - add a track to the collection
	 * @param {String} user
	 * @param {String} track
	 * @return {Boolean}
	 * @api public
	 */
	add: function(info, cb) {
		var Track = mongoose.model('Track');
		var track = new Track();
		var _track = info.track;
		track.key       = _track.key;
		track.name 		= _track.name;
		track.added     = Date.now();
		track.user_id   = info.user_id;
		track.artist    = _track.artist;
		track.album     = _track.album;
		track.duration  = _track.duration;
		track.explicit  = _track.isExplicit;
		track.art = _track.art;

		track.save(function(err, doc) {
			//handle error
			if (err) {
			}
			if(cb) {
				cb(doc);
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