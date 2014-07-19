'use strict';

/**
 * @ngdoc directive
 * @name chasaugeApp.directive:points
 * @description
 * # points
 */
angular.module('app')
  .directive('points', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
			scope: {
				data: '='
			},
      link: function postLink(scope, element, attrs) {
	      scope.$watch('data', function(value) {
		      element.text(value.toString());
	      }, true);
      }
    };
  });
