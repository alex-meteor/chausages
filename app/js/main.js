/*globals R, Main, Modernizr, rdioUtils */

(function() {

	window.Main = {
		// ----------
		init: function() {
			var self = this;
			
			this.$input = $(".search input");
			this.$results = $(".results");

			R.ready(function() {

				self.socket = io.connect('/chausauge');
				self.socket.on('welcome', function(data) {
						console.log(data.msg);
				});

				self.socket.on('queue:add', function(data) {
					console.log(data.msg);
					
				});

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
					console.log('about to emit results to client');
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