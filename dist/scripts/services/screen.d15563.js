'use strict';

angular.module('app').service('Screen', ['Api',
  function (Api) {
    var nextData;
    var service = {
      getScreens : getScreens,
      createScreen : createScreen,
      updateScreen : updateScreen,
    };
    return service;
    function getScreens(page){
      return Api.request({
        url : "/admin/screens",
        cache : false        
      })
    }
    function createScreen(data){
      return Api.request({
        url :"/admin/screens",
        method : "POST",
        data : data,
      })
    }
    function updateScreen(data){
      return Api.request({
        url :"/admin/screens/"+data.id,
        method : "PUT",
        data : data
      })
    }
  }
]);
