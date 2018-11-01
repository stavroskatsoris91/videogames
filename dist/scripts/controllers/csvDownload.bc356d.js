app.controller('csvDownloadCtrl', ['Stats','Utils','$mdDialog','$state','$timeout','$stateParams', '$scope',
                    function(Stats,Utils,$mdDialog,$state,$timeout,$stateParams,$scope) {
    var vm = this;
    vm.profileStats = profileStats;
    vm.orderStats = orderStats;
    vm.cardStats = cardStats;
    vm.cancel = cancel;
    vm.canceled = false;

    vm.loading= false;

    function profileStats(){
        vm.loading = !vm.canceled;
        var today = new Date()
        Stats.getProfileCsv().then(function(res){
            if(res){
                Utils.csvDownload(res, 'profile-stats-' + today.toISOString().slice(0, 10) + '.csv')
                vm.loading= false;
            }else if(!vm.canceled){
                $timeout(function(){profileStats();},2000);
            }else{
                vm.canceled = false;
            }
        })
    }
    function orderStats(){
        vm.loading = !vm.canceled;
        var today = new Date()
        Stats.getOrderCsv().then(function(res){
            if(res){
                Utils.csvDownload(res, 'order-stats-' + today.toISOString().slice(0, 10) + '.csv')
                vm.loading= false;
            }else if(!vm.canceled){
                $timeout(function(){orderStats();}, 2000);
            }else{
                vm.canceled = false;
            }
       })
    }
    function cardStats(){
        vm.loading = !vm.canceled;
        var today = new Date()
        Stats.getCardCsv().then(function(res){
            if(res){
                Utils.csvDownload(res, 'card-stats-' + today.toISOString().slice(0, 10) + '.csv')
                vm.loading= false;
            }else if(!vm.canceled){
                $timeout(function(){cardStats();},2000);
            }else{
                vm.canceled = false;
            }
        }).catch(function(err){
            $timeout(function(){cardStats();},2000);
        })
    }
    function cancel(){
        vm.canceled = true;
        vm.loading = false;
    }
}]);