var mongoose = require('mongoose');

var sockets = function(io, server, config, app) {

var socket = io.listen(server);

	var client = socket.of('/chausauge').on('connection', function (socket) {
		// Broadcast message to everyone in this namespace
		client.emit('welcome', { msg: 'welcome to the chausauge namespace!' });
		// client.emit('service:rdio:search', {query: "London Calling"});
		/*
		*	Client actions
		*/
		socket.on('service:rdio:search', function(data){
			client.emit('service:rdio:search:r', {query: data.query});
		});

		socket.on('service:rdio:search:results', function(data){
			console.log(data);
		});

		socket.on('service:rdio:search:r:results', function(data){
			client.emit('service:rdio:search:results', {results: data.results});
		});

		socket.on('queue:add', function(data) {
			var Queue = mongoose.model('Queue');
			var queue = new Queue();
			queue.add(data, client);
		});

		socket.on('track:vote', function(data) {
			console.log('******************** TRACK VOTE ***************', data);
			//var data = {'track_id': '53cb8fab73ae8ab568e9922a', 'user_id': '571656f8-d440-447f-684d-f346b49a682e', 'vote': false};
			var Queue = mongoose.model('Queue');
			var queue = new Queue();
			queue.vote(data, client);
		});

		socket.on('user:get', function(data) {
			var User = mongoose.model('User');
			var user = new User();
			var doc  = user.get(data._id, client);
		});

		socket.on('user:register', function(data) {
			var User = mongoose.model('User');
			var user = new User();
			var doc  = user.register(data, client);
		});
	});

	
	// Routing
	require('./routes')(app, socket);

};

module.exports = sockets;