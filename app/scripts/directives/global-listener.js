'use strict';
angular.module('videogamesApp').directive('globalListener', function () {
    return {
        scope: {},
        bindToController: {},
        restrict: 'A',
        controllerAs: 'Ctrl',
        controller: function ($scope, $location, $element,$rootScope) {

            var keys = {
                a:'left',
                d:'right',
                s:'down',
                w:'up'
            };
            $element.keypress(function (e) {
                $rootScope.$broadcast('keypress',
                {
                    key:keys[e.originalEvent.key.toLowerCase()],
                    time:new Date().getTime()
                });
            })
            .keydown(function(e){
                $rootScope.$broadcast('keydown',
                {
                    key:keys[e.originalEvent.key.toLowerCase()],
                    time:new Date().getTime()
                });
            })
            .keyup(function(e){
                $rootScope.$broadcast('keyup',
                {
                    key:keys[e.originalEvent.key.toLowerCase()],
                    time:new Date().getTime()
                });
            });
        }
    };
});