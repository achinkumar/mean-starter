angular.module('genAppApp')
    .controller('ForgotPwdCtrl', function ($scope, Auth, $location,$http) {
        $scope.errors = {};

        $scope.ForgotPassword = function (form) {
            $scope.submitted = true;

            if (form.$valid) {
                Auth.forgotPassword($scope.user.email,$http)
                    .then(function () {
                        // Logged in, redirect to home
                        // $cookieStore.put('user', $scope.user);
                        $location.path('/login');
                    })
                    .
                catch (function () {
                    $scope.errors.other = 'Incorrect email';
                });
            }
        };
    });