'use strict';

angular.module('app')
  .controller('SearchController', function ($rootScope, $scope, Search, socket) {

  		var _this = this;

		$scope.$watch(function(){
			return _this.query;
		}, _.debounce(function (id) {
		    // This code will be invoked after 1 second from the last time 'id' has changed.
		    Search.query = id;
		    $scope.$apply(function(){
		        // Code that does something based on $scope.id
		        console.log('emiting search query from model');
		        Search.search();
		        // socket.emit('service:rdio:search', {query: $scope.searchQuery});
		    })
		}, 1000));
		this.query = Search.query;
		this.list = Search.list;
  });
