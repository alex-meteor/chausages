'use strict';

/**
 * @ngdoc directive
 * @name chasaugeApp.directive:song
 * @description
 * # song
 */
angular.module('app')
  .directive('track', function () {
    return {
      templateUrl: 'partials/song.html',
      restrict: 'E',
	    scope: {
		    art: '@',
		    name: '@',
		    extra: '@'
	    },
      link: function postLink(scope, element, attrs) {
				scope.toggle = { info: false };
      }
    };
  });
