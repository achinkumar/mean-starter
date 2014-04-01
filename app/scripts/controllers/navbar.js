'use strict';

angular.module('genAppApp')
    .controller('NavbarCtrl', function ($scope, $location, Auth) {
        $scope.menu = [{
            'title': 'Home',
            'link': '/'
    }, {
            'title': 'Pay',
            'link': '/pay'
    }, {
            'title': 'Settings',
            'link': '/settings'
    }];

        $scope.logout = function () {
            Auth.logout()
                .then(function () {
                    $location.path('/login');
                });
        };

        $scope.isActive = function (route) {
            return route === $location.path();
        };
    });