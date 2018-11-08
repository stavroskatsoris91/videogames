'use strict';

/**
 * @ngdoc overview
 * @name videogamesApp
 * @description
 * # videogamesApp
 *
 * Main module of the application.
 */
angular
  .module('videogamesApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider,$locationProvider) {
    $locationProvider.hashPrefix('');
    $locationProvider.html5Mode({
      enabled: false,
      requireBase: true
    });
    // function load(srcs, callback) {
    //   return {
    //       deps: ['$ocLazyLoad', '$q','MODULE_CONFIG',
    //         function( $ocLazyLoad, $q ,MODULE_CONFIG){
    //           var deferred = $q.defer();
    //           var promise  = false;
    //           srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
    //           if(!promise){
    //             promise = deferred.promise;
    //           }
    //           angular.forEach(srcs, function(src) {
    //             promise = promise.then( function(){
    //               var name = null;
    //               angular.forEach(MODULE_CONFIG, function(module) {
    //                 if( module.name === src){
    //                   if(!module.module){
    //                     name = module.files;
    //                   }else{
    //                     name = module.name;
    //                   }
    //                 }else{
    //                   name = src;
    //                 }
    //               });
    //               return $ocLazyLoad.load(name);
    //             } );
    //           });
    //           deferred.resolve();
    //           return callback ? promise.then(function(){ return callback(); }) : promise;
    //       }]
    //   };
    // }
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/game', {
        templateUrl: '/views/game.html',
        controller: 'GameCtrl',
        controllerAs: 'Ctrl',
      })
      .otherwise('/');
      
  });
