app.controller('campaignListCtrl', ['Discount','$mdDialog','$state','$stateParams', '$scope',
                    function(Discount,$mdDialog,$state,$stateParams,$scope) {
    var vm = this;
        vm.campaign = $stateParams.campaignType;
        vm.finish = false;
        vm.test = "";
        vm.campaignList = {};
        vm.active = active;
        vm.arrow = arrow
        vm.selected= null;
        vm.reverse = null;
        vm.today = new Date();
        vm.text = "";
        vm.notes =['credits','Credit campaigns give thortful credits to the redeemer when using a coupon code, without the need to purchase anything.',
                   'coupon', 'Coupon campaigns provides the redeemer of a given coupon code with discounts (product OR postage) on his current basket and can as well give credit to use on future purchase',
                    'basket','Basket campaigns automatically apply discount on the current basket based on number of items / type of items',
                    'referral','The referral campaign defines the member gets member scheme on thortful.'];
        vm.text = vm.notes[vm.notes.indexOf(vm.campaign)+1];
        
        Discount.getCampaign(vm.campaign).then(function (res) {
            vm.campaignList =res;
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