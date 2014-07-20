'use strict';

angular.module('app')
  .controller('SearchController', function ($rootScope, $scope, User, Auth, socket) {
		var query = 'Search Query';

		Object.defineProperty(this, 'query', {
			get: function() { return query; },
			set: function(value) { query = value; }
		});

		$scope.$watch("searchQuery", _.debounce(function (id) {
		    // This code will be invoked after 1 second from the last time 'id' has changed.
		    $scope.$apply(function(){
		        // Code that does something based on $scope.id
		        console.log('emiting search query from model');
		        socket.emit('service:rdio:search', {query: $scope.searchQuery});
		    })
		}, 1000));

		$scope.addToQueue = function(songKey){
			console.log(songKey);

			$rootScope.trackQueue.push(songKey);
		};

		this.results = [];

		socket.forward('service:rdio:search:results', $scope);

		$scope.$on('socket:service:rdio:search:results', function (env, data){
			console.log('got search data');
			console.log(data);
			$scope.rdioSearchResults = data.results;
		});
  });
