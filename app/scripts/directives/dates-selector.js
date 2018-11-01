angular.module('app')
.controller('DatesSelectorController', ['$scope','$timeout', '$rootScope', 'Cards', function($scope,$timeout,$rootScope,Cards) {
    
    var ds = this;
    ds.setDateRange = setDateRange;
    ds.refresh = refresh;
    ds.init = init;

    // TODO : Probably need a better way
    ds.load = function () {
      $timeout(function () {
        ds.callback()},200);
    }

    

    function init() {
      if ($rootScope.dateSelector) {
        ds.toDate = $rootScope.dateSelector.toDate;
        ds.fromDate = $rootScope.dateSelector.fromDate;
        ds.dateType = $rootScope.dateSelector.dateType;
        ds.groupBy = $rootScope.dateSelector.groupBy;
        
      }else {
        ds.dateType = ds.dateType || '7_days';
        ds.groupBy = 'day';
      }
      if(ds.occasion){
        getCategories();
      }
      setDateRange();
    }
    
    function refresh() {
      // Store that in rootScope
      var dateSelector = {};
      dateSelector.toDate = ds.toDate;
      dateSelector.fromDate = ds.fromDate;
      dateSelector.dateType = ds.dateType;
      dateSelector.groupBy = ds.groupBy;

      $rootScope.dateSelector = dateSelector;

      ds.callback();
    }

    function setDateRange() {
      switch(ds.dateType) {
        case "today" : {
          ds.toDate = new Date();
          ds.fromDate = new Date();
          break;
        }
        case "yesterday" : {
          ds.toDate = new Date(new Date().getTime() - 1* 24 * 60 * 60 * 1000);
          ds.fromDate = new Date(new Date().getTime() - 1* 24 * 60 * 60 * 1000);
          break;
        }
        case "7_days" : {
          ds.toDate = new Date();
          ds.fromDate = new Date(new Date().getTime() - 7* 24 * 60 * 60 * 1000);
          break;
        }
        case "30_days" : {
          ds.toDate = new Date();
          ds.fromDate = new Date(new Date().getTime() - 30* 24 * 60 * 60 * 1000);
          break;          
        }
        case "this_month" : {
          ds.toDate = new Date();
          ds.fromDate = new Date(new Date().setUTCDate(1));
          break;          
        }
        case "last_month" : {
          var beginingLastMonth = new Date();
          beginingLastMonth.setUTCDate(1);
          beginingLastMonth.setMonth(beginingLastMonth.getMonth() - 1);

          var endLastMonth = new Date();

          endLastMonth.setUTCDate(0);

          ds.toDate = endLastMonth;
          ds.fromDate = beginingLastMonth;
          break;          
        }
        case "all_time" : {
          ds.toDate = new Date();
          ds.fromDate = new Date(0);
          break;          
        }
      }
    }
    function getCategories(){
      Cards.getCategories().then(function(res){
        ds.categoryList = res;
      })
    }
}])
.directive('datesSelector', function() {
  return {
    controller : 'DatesSelectorController',
    scope: {
            callback : '&',
            toDate : '=',
            fromDate : '=',
            groupBy : '=',
            dateType : '=',
            excludeAmazon : '=',
            occasion : '=',
            removeAmazon : '=',
            hideGroup : '=',
    },
    bindToController : true,
    controllerAs: 'ds',
    link: {
      pre : function($scope, $elem, $attr){
              $scope.ds.init();
            },
      post : function($scope, $elem, $attr){
              $scope.ds.load();
           }
    },
    templateUrl: 'views/partials/dateselector.html'
  };
});