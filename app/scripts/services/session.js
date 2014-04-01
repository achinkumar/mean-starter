'use strict';

angular.module('genAppApp')
    .factory('Session', function ($resource) {
        return $resource('/api/session/');
    });