var mongoose = require('mongoose');

var sockets = function(io, server, config, app) {

var socket = io.listen(server);

	// //socket.io config
	// socket.configure(function() {
	// 	socket.set('log level', 1);
	// 	socket.set('heartbeat timeout', 27);
	// });

	

	var client = socket.of('/chausauge').on('connection', function (socket) {
		console.log('Chausauge connected');
		// Broadcast message to everyone in this namespace
		client.emit('welcome', { msg: 'welcome to the chausauge namespace!' });
		// client.emit('service:rdio:search', {query: "London Calling"});
		/*
		*	Client actions
		*/
		socket.on('service:rdio:search', function(data){
			console.log('received first emit');
			client.emit('service:rdio:search:r', {query: data.query});
		});

		socket.on('service:rdio:search:results', function(data){
			console.log(data);
		});

		socket.on('service:rdio:search:r:results', function(data){
			console.log('about to emit to client');
			client.emit('service:rdio:search:results', {results: data.results});
		});

		socket.on('queue:add', function(data){
			console.log('about to add to queue');
			client.emit('update:queue', { track: data.track });
		});

		//test add vote
		//var info = {'user_id': 1, 'track_id': '1', 'vote': false};
		//var Queue = mongoose.model('Queue');
		//var queue = new Queue();
		//queue.add(info);
		//queue.vote(info, socket);

		socket.on('user:get', function(data){
			var User = mongoose.model('User');
			var user = new User();
			var doc = user.get(data._id, socket);
			//var info = {'_id': 'xyz', 'name': 'dillweed', 'password': 'butthole'};
			//var doc = user.register(data, socket);
			console.log(doc);
		})

		
	});

	
	// Routing
	require('./routes')(app, socket);

};

module.exports = sockets;