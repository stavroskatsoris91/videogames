'use strict';
angular.module('videogamesApp')
    .directive('header', function () {
        return {
            scope: {},
            bindToController: {},
            restrict: 'E',
            templateUrl: '/views/header.html',
            replace: true,
            controllerAs: 'Ctrl',
            controller: function ($scope, $location) {
                //var Ctrl = this;
                $scope.location = $location;
            },
        };
    });
