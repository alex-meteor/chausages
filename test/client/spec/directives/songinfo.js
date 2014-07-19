'use strict';

describe('Directive: songInfo', function () {

  // load the directive's module
  beforeEach(module('chasaugeApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<song-info></song-info>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the songInfo directive');
  }));
});
