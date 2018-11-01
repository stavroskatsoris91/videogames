'use strict';

angular.module('app').service('Api', ['$http', '$q','$httpParamSerializer','$state','jwtHelper','$mdDialog','$cacheFactory',

  function ($http,$q,$httpParamSerializer,$state,jwtHelper,$mdDialog,$cacheFactory) {
    var service = {
      request : apiRequest,
      isLoggedIn : isLoggedIn
    };
    return service;

    function isTokenValid(token){
      return true;
        // if (!token) {
        //   return false;
        // }
        // var expiry = jwtHelper.decodeToken(token).exp;
        // if (expiry) {
        //   var expiryDate = new Date(expiry);
        //   var today = new Date();
        //   if (today < expiryDate) {  
        //     return true;
        //   }
        // }
        // return false;
    }

    function isLoggedIn() {
        var token = localStorage.getItem('user_token');
        if (isTokenValid(token)) {
            console.log("Token expiry date ",jwtHelper.getTokenExpirationDate(token));
            return true;
        } else {
            return false;
        }    
    }

    function userToken() {
        return localStorage.getItem('user_token');
    }

    function apiRequest(url, opts){

    //   if (!isLoggedIn()) {
    //       $state.transitionTo('access.signin',{message : "you've been logged out"});
    //   }
      var self = this;

    //  var mode="GIRAFFE";

    //  var baseUrl = "https://giraffe.thortful.com";
    //  var apiSecret = "something";
    //  var apiKey = "something";

    //  if (mode == "LIVE") {
    //    baseUrl = "https://admin.thortful.com";
    //    apiKey = "xoobe9UC2l8yOHIMy89rhRCm";
    //    apiSecret = "IfO5XWgKH4UE3k4vQwzjGULva/cuOwSrjpN0+14AiVclPwab";
    //  }

    //  console.log("API Client in " + mode + " Mode");
    //   // save a reference to the `data` attribute, if it's not a plain object.
    //   // This is because objects like FormData will be destroyed by
    //   // `angular.merge`. So after we merge with `options`, we restore `data`
    //   // to the original value. Angular's `$http` will use FormData correctly
    //   // if we give it a reference to such objects.
    //   var dataRef = null;
    //   function _saveDataRef(obj) {
    //     if(obj.data && obj.data.constructor !== obj) {
    //       dataRef = obj.data;
    //     }
    //   }

    //   var options = {
    //     method: 'GET',
    //     headers: {},
    //     useUserToken: true,
    //     returnWholeObject: false,
    //     useApiKeys: true,
    //     data: null,
    //     dataFormat: 'json',
    //     cacheBusting: false,
    //     cache: true,
    //     useJQLikeSerialisation: false,
    //     reportFailures: true,
    //     origin: ""
    //   };

    //   // one argument that is an object - assume it's a config object
    //   if(opts === undefined && typeof url === 'object' && url !== null){
    //     _saveDataRef(url);
    //     angular.merge(options, url);
    //   // one argument that is a string - assume it's an url
    //   } else if(opts === undefined && typeof url === 'string'){
    //     angular.merge(options, {
    //       url: url
    //     });
    //   // two arguments - url and options
    //   } else if(typeof url === 'string' && typeof opts === 'object') {
    //     _saveDataRef(opts)
    //     angular.merge(options, { url: url }, opts);
    //   } else {
    //     throw new Error('Invalid call of `apiRequest`, please check documentation');
    //   }

    //   var httpObj = {
    //     url: baseUrl + options.url,
    //     method: options.method,
    //     headers: options.headers,
    //     cache: options.cache
    //   };

    //   if(dataRef){
    //     httpObj.data = dataRef;
    //   }

    //   if(options.cache === false) {
    //     httpObj.headers['Cache-Control'] = 'no-cache';
    //   }

    //   if(options.useUserToken) {
    //       httpObj.headers.user_token = userToken();
    //   }

    //   if(options.useApiKeys) {
    //     httpObj.headers.API_KEY = apiKey;
    //     httpObj.headers.API_SECRET = apiSecret;
    //   }

    //   if(options.dataFormat === "form") {
    //     httpObj.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    //     if(options.useJQLikeSerialisation) {
    //       httpObj.data = $httpParamSerializerJQLike(httpObj.data);
    //     } else {
    //       httpObj.data = $httpParamSerializer(httpObj.data);
    //       // remove the escaped newline
    //       // HACK, should be changed
    //       httpObj.data = httpObj.data.replace(new RegExp("%5C%5Cn",'g'), "%5Cn");
    //     }
    //   } else if(options.dataFormat === "multipart") {
    //     httpObj.headers['Content-Type'] = undefined;
    //     httpObj.transformRequest = angular.identity;
    //   } else if(options.dataFormat === "urlParams") {
    //     httpObj.data = null;
    //     httpObj.params = options.data;
    //   }else if(options.dataFormat = 'string'){
    //     httpObj.data = JSON.stringify(httpObj.data);
    //   } else if(options.dataFormat !== "json") {
        
    //   }

    //   if(options.cacheBusting) {
    //     var randomNumber = Math.random();
    //     httpObj.url = httpObj.url + "?=" + randomNumber;
    //   }
    //   if(options.transformResponse === false){
    //     httpObj.transformResponse = undefined;
    //   }

    //   $http(httpObj).then(function(res) {
        
    //     // Cache cleaning after update
    //     if (httpObj.method == "PUT") {
    //       var httpCache = $cacheFactory.get('$http');
    //       httpCache.remove(httpObj.url);
    //     }

    //     if(options.returnWholeObject) {
    //       deferred.resolve(res);
    //     } else {
    //       deferred.resolve(res.data);
    //     }
    //   }).catch(function(err) {
    //     console.log("API Failure with ",err);
    //     // Forbidden
    //     if (err.status == "403") {
    //        $mdDialog.show(
    //             $mdDialog.alert()
    //                 .title('No Access')
    //                 .content("Looks like you have insufficient credentials to access this section. Please contact you know who.")
    //                 .ok('Ok')
    //         ).then(function(){
    //           deferred.reject(err);
    //         });
    //     }else{
    //       deferred.reject(err);
    //     }
    //   });
      var deferred = $q.defer();
      deferred.resolve({});
      return deferred.promise;
    }
  }
]);