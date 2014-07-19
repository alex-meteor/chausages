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
		/*
		*	Client actions
		*/
		socket.on('queue:add', function(data){
			console.log(data.song);
			socket.emit('update:queue', {song: data.song});
		});
	
	});

	
	// Routing
	require('./routes')(app, socket);
			

};

module.exports = sockets;