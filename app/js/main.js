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
					console.log(data.msg);
				});

				self.socket.on('service:rdio:search', function(data) {
					var results = self.search(data.query);
					console.log(results);
				});

				// R.request({
				// 	method: "search", 
				// 	content: {
				// 		query: "science of selling",
				// 		types: "Track"
				// 	},
				// 	success: function(response) {
				// 		self.showResults(response.result);
				// 	},
				// 	error: function(response) {
				// 		$(".error").text(response.message);
				// 	}
				// });
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
					self.socket.emit("service:rdio:search:results", {"results" : response.result.results});
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
		},
		// ----------
		showResults: function(albums) {
			console.log('showing results');
			var self = this;
			this.$results.empty();
			console.log(albums);
			_.each(albums.results, function(album) {
				console.log(album);
				album.appUrl = album.shortUrl.replace("http", "rdio");
				var $el = $('<span class="album">'
						+'<div class="icon" style="background-image: url(' + album.icon +')">'
							+'<div class="buttons">'
							 +'<span class="play btn">Play Album</span>'
								+'<a href="http://www.rdio.com' + album.url + '" target="_blank" class="site btn">View on Rdio.com</a>'
								+'<a href="'+ album.appUrl + '" target="_blank" class="app btn">View in Rdio app</a>'
							+'</div>'
						+'</div>'
						+'<div class="title label">' + album.name + '</div>'
						+'<div class="artist label">' + album.artist + '</div>'
					+'</span>').appendTo(self.$results);
				
			});
		}
	};
	
	// ----------
	$(document).ready(function() {
		Main.init();
	});
	
})();  