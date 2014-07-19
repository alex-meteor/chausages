'use strict';

angular.module('app')
  .controller('SearchController', function ($scope, User, Auth) {
		var query = 'Search Query';

		Object.defineProperty(this, 'query', {
			get: function() { return query; },
			set: function(value) { query = value; }
		});

		this.results = [];
  });
