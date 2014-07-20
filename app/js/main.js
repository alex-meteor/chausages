/*globals R, Main, Modernizr, rdioUtils */

(function() {

	window.Main = {
		// ----------
		init: function() {
			var self = this;
			
			this.$input = $(".search input");
			this.$results = $(".results");
			this.playing = null;

			R.ready(function() {

				R.player.on("change:playingTrack",function(data){
					console.log('track changed');
					console.log(data);
					self.socket.emit('queue:update',{remove: self.playing, playing: data.attributes});
					self.playing = data.attributes.key;
				});

				$('.play').click(function(){
					R.player.queue.play();
				});

				$('.next').click(function(){
					R.player.next();
				});

				$('.clear').click(function(){
					R.player.queue.clear();
				});

				self.socket = io.connect('/chausauge');
				self.socket.on('welcome', function(data) {
						console.log(data.msg);
				});

				self.socket.on('queue:update:list', function(data){
					console.log('updating queue');
					var list;
					if(data.list){
						R.player.queue.clear();
						list = _.sortBy(data.list, function(track) { 
							_.countBy(track.votes, function(vote) { 
								vote.vote ? 1 : -1; 
							})
						});
						console.log(list);
						_.each(list, function(track){
							console.log('each', track.info.key);
							R.player.queue.add(track.info.key);
						})
					}
				});

				// self.socket.on('queue:add', function(data) {
				// 	console.log("new song to add to queue", data);
				// 	R.player.queue.add(data.key);
				// });

				self.socket.on('queue:remove', function(data) {
					console.log(data.msg);
				});

				self.socket.on('queue:vote', function(data) {
					console.log(data);
					var fromIndex = 0;
					var toIndex = 1;
					R.player.queue.move(fromIndex, toIndex);
				});

				self.socket.on('service:rdio:search:r', function(data) {
					console.log('recieved search r', data);
					var results = self.search(data.query);
				});
			});
		}, 
		
		// ----------
		search: function(query) {
			var self = this;
			R.request({
				method: "search", 
				content: {
					query: query, 
					types: "Track"
				},
				success: function(response) {
					console.log(response.result.results);
					console.log('about to emit results to server');
					self.socket.emit("service:rdio:search:r:results", {"results" : response.result.results});
					return response.result.results;
				},
				error: function(response) {
					return "there was an error";
				}
			});
		},
		addToQueue: function(track){
			console.log(track);
			var self = this;
			R.player.queue.add(track.key);
			R.player.queue.play();
		}
	};
	
	// ----------
	$(document).ready(function() {
		Main.init();
	});
	
})();  