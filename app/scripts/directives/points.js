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
	    restrict: 'E',
	    scope: {
		    votes: '='
	    },
	    link: function postLink(scope, element, attrs) {
		    scope.$watch( 'votes', function (value) {
			    var i = 0, count = 0;
			    if(value) {
				    for (i; i < value.length; i++) {
					    if (value[i].vote) {
						    count++;
					    } else {
						    count--;
					    }
				    }
				    element.text(count.toString());
			    }
		    }, true);
	    }
    }
  });