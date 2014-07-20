'use strict';

angular.module('app', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'btford.socket-io'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/queue', {
        templateUrl: 'partials/queue.html',
        controller: 'QueueController as Queue'
      })
      .when('/search', {
        templateUrl: 'partials/search.html',
        controller: 'SearchController as Search'
      })
      .when('/profile', {
        templateUrl: 'partials/profile.html',
        controller: 'ProfileController as Profile',
		    authenticate: true
      })
	    .when('/login', {
		    templateUrl: 'partials/login.html',
		    controller: 'LoginController as Login'
	    })
	    .when('/register', {
		    templateUrl: 'partials/register.html',
		    controller: 'RegisterController as Register'
	    })
      .when('/about', {
        templateUrl: 'partials/about.html'
      })
      .otherwise({
        redirectTo: '/queue'
      });
      
    $locationProvider.html5Mode(true);
      
    // Intercept 401s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401) {
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);
  })
  .run(function ($rootScope, $location, Auth) {

    $rootScope.trackQueue = [];

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {
      
      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });
  });