'use strict';
app.controller('profileListCtrl', ['$scope', 'Profile','$mdDialog','$state','$stateParams', 
                    function($scope,Profile,$mdDialog,$state,$stateParams) {


  var vm = this;
  vm.search = search;
  vm.emailSearch = emailSearch;

  function search() {
    if(vm.input && vm.input != "") {
      Profile.search(vm.input).then(function(res){
        vm.searchList = res;
        console.log("Search List",res);
      }).catch(function(err) {
            // Error handling
      });
    }
  }

  function emailSearch() {
    if(vm.email && vm.email != "") {
      Profile.emailSearch(vm.email).then(function(res){
        vm.searchList = res;
        console.log("Search List",res);
      }).catch(function(err) {
            // Error handling
      });
    }
  }

  }
]);
