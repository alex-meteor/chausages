'use strict';

angular.module('app')
  .controller('ProfileController', function ($scope, $location, Auth) {
		this.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/login');
      });
    };
  });
