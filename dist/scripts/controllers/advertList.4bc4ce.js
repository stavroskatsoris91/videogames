app.controller('advertListCtrl', ['Advert','$mdDialog','$state','$stateParams', '$scope',
                    function(Advert,$mdDialog,$state,$stateParams,$scope) {
    var vm = this;
        vm.finish = false;
        vm.test = "";
        vm.advertList = {};
        vm.active = active;
        vm.arrow = arrow;
        vm.selected= null;
        vm.reverse = null;

        getAdvertList();
        
        function getAdvertList(){
            Advert.getAdvertList().then(function (res) {
                vm.advertList =res;
                    vm.finish = true;
            });
        }
        function active(query){
            if(query===vm.selected&&!vm.reverse)
            {
                vm.reverse = "reverse";
            }else{
                vm.selected =query;
                vm.reverse = null;
            }
        }
        function arrow(query){
            if(vm.selected===query){
                if(vm.reverse){
                    return "mdi-navigation-arrow-drop-up"
                }
                return "mdi-navigation-arrow-drop-down"
            }
        }
}]);