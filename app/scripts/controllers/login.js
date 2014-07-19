'use strict';

angular.module('app')
  .controller('LoginController', function ($scope, Auth, $location) {
    var _this = this;
		_this.user = {};
    _this.errors = {};
    _this.submit = function(form) {
      _this.submitted = true;
      
      if(form.$valid) {
        Auth.login(_this.user)
        .then( function() {
          // Logged in, redirect to home
          $location.path('/profile');
        })
        .catch( function(err) {
          err = err.data;
          _this.errors.other = err.message;
        });
      }
    };
  });