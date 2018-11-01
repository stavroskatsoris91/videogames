'use strict';

/**
 * @ngdoc function
 * @name app.config:uiRouter
 * @description
 * # Config
 * Config for the router
 */
angular.module('app')
  .run(
    [           '$rootScope', '$state', '$stateParams',
      function ( $rootScope,   $state,   $stateParams ) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider', 'MODULE_CONFIG',
      function ( $stateProvider,   $urlRouterProvider,  MODULE_CONFIG ) {
        var p = getParams('layout'),
            l = p ? p + '.' : '',
            layout = 'views/layout.html',
            aside  = 'views/aside.html',
            content= 'views/content.html';

        $urlRouterProvider
          .otherwise('/app/dashboard');
        $stateProvider
          .state('app', {
            abstract: true,
            url: '/app',
            views: {
              '': {
                templateUrl: layout
              },
              'aside': {
                templateUrl: aside,
                controller: 'MenuCtrl',
                controllerAs : 'vm',
                resolve: load('scripts/controllers/menu.js')
              },
              'content': {
                templateUrl: content
              }
            }
          })
            .state('app.dashboard', {
              url: '/dashboard',
              templateUrl: 'views/pages/dashboard.html',
              data : { title: 'Dashboard'},
              controller : "dashboardCtrl",
              controllerAs : "vm",
              resolve: load(['scripts/controllers/dashboard.js'])
            })
            .state('app.sales', {
              url: '/sales',
              templateUrl: 'views/pages/dashboard.sales.html',
              data : { title: 'Sales' },
              controller : "salesCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/sales.js')
            })
            .state('app.product', {
              url: '/product',
              templateUrl: 'views/pages/dashboard.product.html',
              data : { title: 'Product' },
              controller : "productCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/product.js')
            })
            .state('app.acquisition', {
              url: '/acquisition',
              templateUrl: 'views/pages/dashboard.acquisition.html',
              data : { title: 'Acquisition' },
              controller : "acquisitionCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/acquisition.js')
            })
            .state('app.audience', {
              url: '/audience',
              templateUrl: 'views/pages/dashboard.audience.html',
              data : { title: 'Audience' },
              controller : "audienceCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/audience.js')
            })
            .state('app.campaign', {
              url: '/campaign',
              templateUrl: 'views/pages/dashboard.campaign.html',
              data : { title: 'Campaigns' },
              controller : "campaignSalesCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/campaign-sales.js')
            })
            .state('app.orderStatus', {
              url: '/orders',
              templateUrl: 'views/pages/dashboard.orderStatus.html',
              data : { title: 'Order Status' },
              controller : "orderStatusCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/orderStatus.js')
            })
            .state('app.selfHelp', {
              url: '/selfhelp?:page&:date_type&:from_date&to_date',
              templateUrl: 'views/pages/dashboard.selfHelp.html',
              data : { title: 'selfHelp' },
              controller : "selfHelpCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/selfHelp.js')
            });


          function load(srcs, callback) {
            return {
                deps: ['$ocLazyLoad', '$q',
                  function( $ocLazyLoad, $q ){
                    var deferred = $q.defer();
                    var promise  = false;
                    srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                    if(!promise){
                      promise = deferred.promise;
                    }
                    angular.forEach(srcs, function(src) {
                      promise = promise.then( function(){
                        angular.forEach(MODULE_CONFIG, function(module) {
                          if( module.name == src){
                            if(!module.module){
                              name = module.files;
                            }else{
                              name = module.name;
                            }
                          }else{
                            name = src;
                          }
                        });
                        return $ocLazyLoad.load(name);
                      } );
                    });
                    deferred.resolve();
                    return callback ? promise.then(function(){ return callback(); }) : promise;
                }]
            }
          }

          function getParams(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
          }

      }
    ]
  );
