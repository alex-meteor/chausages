'use strict';

/**
 * @ngdoc directive
 * @name chasaugeApp.directive:vote
 * @description
 * # vote
 */
angular.module('app')
  .directive('vote', function () {
    return {
      restrict: 'E',
      link: function postLink(scope, element, attrs) { }
    };
  });
