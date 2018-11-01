'use strict';

angular.module('app').service('UINotification', ['$mdToast','$mdDialog','$timeout','$rootScope',

  function ($mdToast,$mdDialog,$timeout,$rootScope) {
    
    var service = {
      success : success,
      error : error,
      loadingStart : loadingStart
    };

    var SUCCESS = 1;
    var ERROR = 2;
    var INFO = 3;

    return service;

    function error(text) {
      show(ERROR,text);
    }

    function success(text) {
      show(SUCCESS,text);
    }

    function info(text) {
      show(INFO,text);
    }

    function show(type,text) {

      var icon = "";
      var color = "";

      switch (type) {
        case SUCCESS: 
          icon = "mdi-navigation-check";
          color = "text-success";
          break;
        case ERROR:
          icon = "mdi-content-report";
          color = "text-danger"
          break;
        case INFO:
          icon = "";
          color = "";
      }
      $mdToast.show({
        hideDelay   : 3000,
        position    : 'top right',
        templateUrl : 'views/partials/toast-template.893b38.html',
        controller : 'toastCtrl',
        locals : {text : text, icon : icon,color:color}
      });
    }

    function loadingStart() {
      var mainView = angular.element('#view');
      mainView.append('   <div class="panel panel-card" id="loader">' +
                      '     <div class="panel-body text-center">' +
                      '        <p>Loading 2</p>'+
                      '        <md-progress-linear md-mode="indeterminate" class="m-b"></md-progress-linear>'+
                      '        <p>after loading indicator</p>' +
                      '      </div>'+
                      '    </div>');
    }
  }

]).controller('toastCtrl',['$scope','text','icon','color', function($scope,text,icon,color) {
  $scope.text = text;
  $scope.icon = icon;
  $scope.color = color;
} ]);