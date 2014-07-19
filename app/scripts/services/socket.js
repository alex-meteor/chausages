'use strict';

angular.module('chasaugeApp')
.factory('socket', function (socketFactory) {
	return socketFactory({
		ioSocket: io.connect('/chausauge')
	});
});
