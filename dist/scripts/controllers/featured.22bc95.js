'use stric';

app.controller('featuredCtrl', ['Profile', 
                    function(Profile) {
    var vm = this;

    vm.featuredList = [];

    init();

    function init () {
        Profile.getFeatured().then(function(res){
            vm.featuredList = res;
            console.log("Featured List",res);
        }).catch(function(err) {
            // Error handling
        });
    }
}]);