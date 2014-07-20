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

		socket.on('queue:add', function(data) {
			// var Queue = mongoose.model('Queue');
			// var queue = new Queue();
			// var doc   = queue.add(data, socket);
			client.emit('update:queue', { track: data.track });
		});

		socket.on('track:vote', function(data) {
			//var data = {'track_id': '53cb8fab73ae8ab568e9922a', 'user_id': '571656f8-d440-447f-684d-f346b49a682e', 'vote': false};
			var Queue = mongoose.model('Queue');
			var queue = new Queue();
			var doc   = queue.vote(data, socket);
		});

		socket.on('user:get', function(data) {
			var User = mongoose.model('User');
			var user = new User();
			var doc  = user.get(data._id, socket);
		});

		socket.on('user:register', function(data) {
			var User = mongoose.model('User');
			var user = new User();
			//var data = {'_id': '571656f8-d440-447f-684d-f346b49a682e', 'name': 'dillweed', 'password': 'butthole'};
			var doc  = user.register(data, socket);
		});

		/**
		var data = {'track_id': 't35041553', 'user_id': '571656f8-d440-447f-684d-f346b49a682e'};
		var Queue = mongoose.model('Queue');
		var queue = new Queue();
		var doc = queue.add(data, socket);
		console.log(doc);
		**/

		var data = {'_id': '53cb88230fcfcdd826f539e5', 'user_id': '571656f8-d440-447f-684d-f346b49a682e', 'vote': false};
		var Queue = mongoose.model('Queue');
		var queue = new Queue();
		var doc   = queue.vote(data, socket);
		
	});

	
	// Routing
	require('./routes')(app, socket);

};

module.exports = sockets;