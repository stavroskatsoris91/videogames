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
            layout = 'views/layout.393169.html',
            aside  = 'views/aside.d2ba64.html',
            content= 'views/content.44055b.html';

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
                resolve: load('scripts/controllers/menu.be17a6.js')
              },
              'content': {
                templateUrl: content
              }
            }
          })
            .state('app.dashboard', {
              url: '/dashboard',
              templateUrl: 'views/pages/dashboard.f2b3b6.html',
              data : { title: 'Dashboard'},
              controller : "dashboardCtrl",
              controllerAs : "vm",
              resolve: load(['scripts/controllers/dashboard.ba4546.js'])
            })
            .state('app.sales', {
              url: '/sales',
              templateUrl: 'views/pages/dashboard.sales.a0dc4c.html',
              data : { title: 'Sales' },
              controller : "salesCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/sales.f30dc8.js')
            })
            .state('app.product', {
              url: '/product',
              templateUrl: 'views/pages/dashboard.product.bf577a.html',
              data : { title: 'Product' },
              controller : "productCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/product.36c66b.js')
            })
            .state('app.acquisition', {
              url: '/acquisition',
              templateUrl: 'views/pages/dashboard.acquisition.43fa13.html',
              data : { title: 'Acquisition' },
              controller : "acquisitionCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/acquisition.327f31.js')
            })
            .state('app.audience', {
              url: '/audience',
              templateUrl: 'views/pages/dashboard.audience.c8c152.html',
              data : { title: 'Audience' },
              controller : "audienceCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/audience.614731.js')
            })
            .state('app.campaign', {
              url: '/campaign',
              templateUrl: 'views/pages/dashboard.campaign.d20779.html',
              data : { title: 'Campaigns' },
              controller : "campaignSalesCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/campaign-sales.512d0c.js')
            })
            .state('app.orderStatus', {
              url: '/orders',
              templateUrl: 'views/pages/dashboard.orderStatus.463c63.html',
              data : { title: 'Order Status' },
              controller : "orderStatusCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/orderStatus.f9cfe6.js')
            })
            .state('app.selfHelp', {
              url: '/selfhelp?:page&:date_type&:from_date&to_date',
              templateUrl: 'views/pages/dashboard.selfHelp.d52e1f.html',
              data : { title: 'selfHelp' },
              controller : "selfHelpCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/selfHelp.da2f74.js')
            })
          .state('users', {
            abstract: true,
            url: '/users',
            views: {
              '': {
                templateUrl: layout
              },
              'aside': {
                templateUrl: aside,
                controller: 'MenuCtrl',
                controllerAs : 'vm',
                resolve: load('scripts/controllers/menu.be17a6.js')
              },
              'content': {
                templateUrl: content
              }
            }
          })                 
            .state('users.list', {
              url: '/list',
              templateUrl: 'views/pages/users.profiles.9ad585.html',
              data : { title: 'Profiles' },
              controller : "profileListCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/profileList.3c3e10.js')
            })
            .state('users.topsellers', {
              url: '/topsellers',
              templateUrl: 'views/pages/users.topsellers.4b3424.html',
              data : { title: 'Top Sellers' },
              controller : "topSellersCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/topSellers.2f26d2.js')
            })            
            .state('users.orders', {
              url: '/orders?:customerId&:procoId&:procoItemId&:transactionId&:recipient&:postcode&:filter&:page&:format',
              templateUrl: 'views/pages/users.orders.706a25.html',
              data : { title: 'Orders' },
              controller : "orderListCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/orderList.caf7c6.js')
            })
            .state('users.featured', {
              url: '/featured',
              templateUrl: 'views/pages/users.featured.e99c7a.html',
              data : { title: 'Featured Profiles' },
              controller : "featuredCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/featured.22bc95.js')
            })
            .state('users.profile', {
              url: '/s/:profileId',
              templateUrl: 'views/pages/users.profile.9d8b4b.html',
              data : { title: 'Profile' },
              controller : "profileCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/profile.ad39ed.js')
            })
            .state('users.order', {
              url: '/orders/:orderId',
              templateUrl: 'views/pages/users.order.eaf480.html',
              data : { title: 'Order' },
              controller : "orderCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/order.d67676.js')
            })
            .state('users.paymentReport', {
              url: '/payment_report',
              templateUrl: 'views/pages/users.paymentReport.b2e88f.html',
              data : { title: 'Payment Report' },
              controller : "paymentReportCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/paymentReport.93bfc8.js')
            })
            .state('users.payments', {
              url: '/payments',
              templateUrl: 'views/pages/users.payments.70ab92.html',
              data : { title: 'Payments' },
              controller : "paymentsCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/payments.f86c1c.js')
            })
          .state('cards', {
            abstract: true,
            url: '/cards',
            views: {
              '': {
                templateUrl: layout
              },
              'aside': {
                templateUrl: aside,
                controller: 'MenuCtrl',
                controllerAs : 'vm',
                resolve: load('scripts/controllers/menu.be17a6.js')
              },
              'content': {
                templateUrl: content
              }
            }
          })
            .state('cards.list', {
              url: '?:filter&:ordered&:retired&:page',
              templateUrl: 'views/pages/cards.list.b9b008.html',
              data : { title: 'Card List' },
              controller : "cardListCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/cardList.58ea87.js')
            })
            .state('cards.byDate', {
              url: '/bydate?:date_ordered&:sales_ordered&:rank_ordered&:page&:date_type&:from_date&to_date',
              templateUrl: 'views/pages/cards.by.date.2bc4d4.html',
              data : { title: 'Cards By Date' },
              controller : "cardsByDateCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/cardsByDate.b0d196.js')
            })
            .state('cards.card', {
              url: '/card/:cardId',
              templateUrl: 'views/pages/cards.card.295810.html',
              data : { title: 'Card' },
              controller : "cardCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/card.94a1cd.js')
            })
            .state('cards.images', {
              url: '/images',
              templateUrl: 'views/pages/artwork.templates.149343.html',
              data : { title: 'Images' },
              controller : "artworkListCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/artworkList.0f73f0.js')
            })
            .state('cards.image', {
              url: '/images/:templateId',
              templateUrl: 'views/pages/artwork.template.007a2f.html',
              data : { title: 'Product Image' },
              controller : "artworkCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/artwork.fdee56.js')
            })    
            .state('cards.options', {
              url: '/options',
              templateUrl: 'views/pages/cards.optionsList.a07908.html',
              data : { title: 'Card options' },
              controller : "itemOptionsCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/itemOptions.444920.js')
            })
            .state('cards.optionsCreate', {
              url: '/options/create',
              templateUrl: 'views/pages/cards.options.955259.html',
              data : { title: 'Create Option',create: true },
              controller : "itemOptionsCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/itemOptions.444920.js')
            })  
            .state('cards.option', {
              url: '/options/:optionId',
              templateUrl: 'views/pages/cards.options.955259.html',
              data : { title: 'Option' },
              controller : "itemOptionsCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/itemOptions.444920.js')
            })                    
            .state('cards.topselling', {
              url: '/topselling',
              templateUrl: 'views/pages/cards.topSelling.4a16a1.html',
              data : { title: 'Top Selling' },
              controller : "topSellingCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/topSelling.db9a79.js')
            })
          .state('marketing', {
            abstract: true,
            url: '/marketing',
            views: {
              '': {
                templateUrl: layout
              },
              'aside': {
                templateUrl: aside,
                controller: 'MenuCtrl',
                controllerAs : 'vm',
                resolve: load('scripts/controllers/menu.be17a6.js')
              },
              'content': {
                templateUrl: content
              }
            }
          })
            .state('marketing.csvDownload', {
              url: '/csvdownload',
              templateUrl: 'views/pages/marketing.csvDownload.309b95.html',
              data : { title: 'CSV Download' },
              controller : "csvDownloadCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/csvDownload.bc356d.js')
            })
            .state('marketing.campaignList', {
              url: '/discount/:campaignType',
              templateUrl: 'views/pages/marketing.campaignList.7129c7.html',
              data : { title: "Campaign List" },
              controller : "campaignListCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/campaignList.7efbbe.js')
            })
            .state('marketing.campaign', {
              url: '/discount/:campaignType/:campaign',
              templateUrl: 'views/pages/marketing.campaign.746488.html',
              data : { title: "Campaign" },
              controller : "campaignCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/campaign.fac21e.js')
            })
            .state('marketing.segment', {
              url: '/segments',
              templateUrl: 'views/pages/marketing.segment.a6a7f0.html',
              data : { title: "Buyers Segments" },
              controller : "segmentCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/segment.9c9097.js')
            })
            .state('marketing.advertList', {
              url: '/adverts',
              templateUrl: 'views/pages/marketing.advertList.31aa0f.html',
              data : { title: "Site Adverts" },
              controller : "advertListCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/advertList.4bc4ce.js')
            })
            .state('marketing.advert', {
              url: '/adverts/:advert',
              templateUrl: 'views/pages/marketing.advert.73a927.html',
              data : { title: "Advert" },
              controller : "advertCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/advert.b68474.js')
            })
            .state('marketing.priceList', {
              url: '/pricing',
              templateUrl: 'views/pages/marketing.priceList.8f3931.html',
              data : { title: "Pricing" },
              controller : "priceListCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/priceList.90212e.js')
            })
            .state('marketing.pricing', {
              url: '/pricing/:id?:format',
              templateUrl: 'views/pages/marketing.pricing.22352b.html',
              data : { title: "Pricing" },
              controller : "pricingCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/pricing.7c1aab.js')
            })
          .state('printing', {
            abstract: true,
            url: '/printing',
            views: {
              '': {
                templateUrl: layout
              },
              'aside': {
                templateUrl: aside,
                controller: 'MenuCtrl',
                controllerAs : 'vm',
                resolve: load('scripts/controllers/menu.be17a6.js')
              },
              'content': {
                templateUrl: content
              }
            }
          })
            .state('printing.center',{
              url: '/center',
              templateUrl: 'views/pages/printing.center.da9666.html',
              data : { title: 'Printer Management' },
              controller : "printingCenterCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/printingCenter.ed134c.js')
            })
            .state('printing.holiday',{
              url: '/holidays',
              templateUrl: 'views/pages/printing.holiday.dcb223.html',
              data : { title: 'Holiday Management' },
              controller : "printingHolidayCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/printingHoliday.ecb120.js')
            })
            .state('printing.stock', {
              url: '/stock',
              templateUrl: 'views/pages/printing.stock.745d8c.html',
              data : { title: 'Stock Report' },
              controller : "printingStockCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/printingStock.1ded3d.js')
            })
            .state('printing.stockManagement', {
              url: '/stockmanagement?:id',
              templateUrl: 'views/pages/printing.stockManagement.490655.html',
              data : { title: 'Stock Management' },
              controller : "stockManagementCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/stockManagement.78accc.js')
            })
            .state('printing.customerService', {
              url: '/customerService',
              templateUrl: 'views/pages/printing.customerService.799b48.html',
              data : { title: 'Dispatch' },
              controller : "customerServiceCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/customerService.72ab42.js')
            }) 
            .state('content', {
              abstract: true,
              url: '/content',
              views: {
                '': {
                  templateUrl: layout
                },
                'aside': {
                  templateUrl: aside,
                  controller: 'MenuCtrl',
                  controllerAs : 'vm',
                  resolve: load('scripts/controllers/menu.be17a6.js')
                },
                'content': {
                  templateUrl: content
                }
              }
            })  
            .state('content.navigation', {
              url: '/navigation',
              templateUrl: 'views/pages/content.navigation.2a1e6f.html',
              data : { title: 'Navigation' },
              controller : "groupManagementCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/groupManagement.9df507.js')
            })
            .state('content.occasions', {
              url: '/occasions',
              templateUrl: 'views/pages/content.occasions.ab9c36.html',
              data : { title: 'Occasions' },
              controller : "occasionCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/occasion.891347.js')
            })
            .state('content.occasion', {
              url: '/occasions/:id',
              templateUrl: 'views/pages/content.occasion.2181b5.html',
              data : { title: 'Occasion' },
              controller : "occasionCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/occasion.891347.js')
            })
            .state('content.occasionFilters', {
              url: '/filters',
              templateUrl: 'views/pages/content.occasionFilters.a27fe7.html',
              data : { title: 'Occasion Filters' },
              controller : "occasionFiltersCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/occasionFilters.586b68.js')
            })
            .state('content.screens', {
              url: '/screens',
              templateUrl: 'views/pages/content.screens.be3b01.html',
              data : { title: 'Screen' },
              controller : "screenManagementCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/screenManagement.eb7ce5.js')
            })
            .state('content.screen', {
              url: '/screens/:id',
              templateUrl: 'views/pages/content.screen.0dc2b5.html',
              data : { title: 'Screen' },
              controller : "screenManagementCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/screenManagement.eb7ce5.js')
            })
            .state('content.cardVariation', {
              url: '/cards/variation?:id',
              templateUrl: 'views/pages/content.cardVariation.851f6a.html',
              data : { title: 'Card Variation' },
              controller : "cardVariationCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/cardVariation.a4e9b4.js')
            })
            .state('content.emojis', {
              url: '/emojis',
              templateUrl: 'views/pages/content.emojis.04125c.html',
              data : { title: 'Emojis' },
              controller : "emojisCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/emojis.0848f7.js')
            })
            .state('explore', {
              abstract: true,
              url: '/explore',
              views: {
                '': {
                  templateUrl: layout
                },
                'aside': {
                  templateUrl: aside,
                  controller: 'MenuCtrl',
                  controllerAs : 'vm',
                  resolve: load('scripts/controllers/menu.be17a6.js')
                },
                'content': {
                  templateUrl: content
                }
              }
            }) 
            .state('explore.index', {
              url: '/index?:id',
              templateUrl: 'views/pages/explore.index.0a4d08.html',
              data : { title: 'Explore' },
              controller : "exploreCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/explore.115669.js')
            })
            .state('technical', {
              abstract: true,
              url: '/technical',
              views: {
                '': {
                  templateUrl: layout
                },
                'aside': {
                  templateUrl: aside,
                  controller: 'MenuCtrl',
                  controllerAs : 'vm',
                  resolve: load('scripts/controllers/menu.be17a6.js')
                },
                'content': {
                  templateUrl: content
                }
              }
            }) 
            .state('technical.trigger', {
              url: '/triggers',
              templateUrl: 'views/pages/technical.trigger.664726.html',
              data : { title: 'Triggers' },
              controller : "triggerCtrl",
              controllerAs : "vm",
              resolve: load('scripts/controllers/trigger.3cf3a7.js')
            })
            .state('access', {
              url: '/access',
              template: '<div class="blue-grey-800 bg-big"><div ui-view class="fade-in-down smooth"></div></div>'
            })
            .state('access.signin', {
              url: '/signin',
              templateUrl: 'views/pages/signin.4dcc9c.html',
              controller: 'loginCtrl',
              controllerAs : 'vm',
              params: {message: null},
              resolve: load('scripts/controllers/login.8abb99.js')
            })
            .state('access.signup', {
              url: '/signup',
              templateUrl: 'views/pages/signup.100504.html'
            })
            .state('access.lockme', {
              url: '/lockme',
              templateUrl: 'views/pages/lockme.b65c2d.html'
            })
          ;


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
