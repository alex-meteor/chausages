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
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the vote directive');
      }
    };
  });
