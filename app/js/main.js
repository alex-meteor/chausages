/*globals R, Main, Modernizr, rdioUtils */

(function() {

	window.Main = {
		// ----------
		init: function() {
			var self = this;
			
			this.$input = $(".search input");
			this.$results = $(".results");

			R.ready(function() {

				var socket = io.connect('/chausauge');
				socket.on('welcome', function(data) {
						console.log(data.msg);
				});

				socket.on('queue:add', function(data) {
					console.log(data.msg);
					
				});

				socket.on('queue:remove', function(data) {
					console.log(data.msg);
				});

				socket.on('queue:vote', function(data) {
					console.log(data.msg);
				});

				socket.on('service:rdio:search', function(data) {
					console.log(data.msg);
				});

				R.player.queue.add("t1271908");
				R.player.queue.play();
				
				R.request({
					method: "search", 
					content: {
						query: "science of selling",
						types: "Track"
					},
					success: function(response) {
						self.showResults(response.result);
					},
					error: function(response) {
						$(".error").text(response.message);
					}
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
					self.$input.val("");
					self.showResults(response.result.results);
				},
				error: function(response) {
					$(".error").text(response.message);
				}
			});
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