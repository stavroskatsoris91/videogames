app.controller('priceListCtrl', ['Pricing','$mdDialog','$state','$stateParams', '$scope',
                    function(Pricing,Discount,$mdDialog,$state,$stateParams,$scope) {
    var vm = this;
        vm.finish = false;
        vm.test = "";
        vm.pricingList = {};
        vm.active = active;
        vm.arrow = arrow;
        vm.selected= 'expense_type';
        vm.reverse = null;

        Pricing.getList().then(function (res) {
            vm.pricingList =res;
                vm.finish = true;
        });
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