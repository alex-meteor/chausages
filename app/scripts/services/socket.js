'use strict';
angular.module('app')
.factory('socket', function (socketFactory) {
	return socketFactory({
		ioSocket: io.connect('/chausauge')
	});
});
