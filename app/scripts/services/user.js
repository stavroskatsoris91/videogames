'use strict';

angular.module('app').service('User', ['Api','$q','ngStore',

  function (Api,$q,ngStore) {
    var service = {
      login : login,
      logout : logout,
      isLoggedIn : isLoggedIn,
      getUser : getUser
    };
    return service;

    function login(username, password){

      var options = {
            method : "POST",
            //Define endpoint URL.
            url: "/v1/auth/thortful/login",
            useUserToken : false,
            dataFormat : "form",
            data : {"address" : username, "password":password}
        };

        var deferred = $q.defer();
        Api.request(options).then(function(res){
            //store the token in LocalStorage
            localStorage.setItem('user_token',res.token);
            deferred.resolve(res);
        }).catch(function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    function logout() {
         localStorage.removeItem('user_token');
    }
    
    function isLoggedIn() {
        return Api.isLoggedIn();
    }

    function getUser() {
        return Api.request("/v1/profile");
    }

  }
]);