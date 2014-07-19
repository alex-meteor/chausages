'use strict';

/**
 * @ngdoc directive
 * @name chasaugeApp.directive:songInfo
 * @description
 * # songInfo
 */
angular.module('app')
  .directive('songInfo', function () {
    return {
      templateUrl: 'partials/song-info.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {}
    };
  });
