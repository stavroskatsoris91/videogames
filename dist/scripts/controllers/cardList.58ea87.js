app.controller('cardListCtrl', ['Cards','UINotification','$mdDialog','$state','$stateParams', '$scope',
                    function(Cards,UINotification,$mdDialog,$state,$stateParams,$scope) {
    var vm = this;
    vm.getList = getList;
    vm.changeFilter = changeFilter;
    vm.changePage = changePage;
    vm.nextCard = nextCard;
    vm.approveCard = approveCard;

    vm.searchList = {};
    vm.loading = false;
    vm.filterList = ["all","unmoderated","retired","ordered","replacement"];

    vm.filter = $stateParams.filter ? $stateParams.filter: vm.filterList[1];
    vm.filter2 = $stateParams.retired ? $stateParams.retired : false;
    vm.filter3 = $stateParams.ordered ? $stateParams.ordered : false;
    vm.page= $stateParams.page ? $stateParams.page-1 : 0;
    vm.text = vm.page+1;
    getList();
    function getList(){
        vm.loading = true;
        Cards.getList(vm.filter,vm.filter2,vm.filter3,vm.page).then(function(res){
            vm.searchList = res;
            vm.loading = false;
            console.log(res);
        }).catch(function(err) {
                vm.loading = false;
            });
    }
    function changeFilter(query){
        vm.page= 0;
        if(query===vm.filterList[2])
        {
            vm.filter2= vm.filter2=="false" ? true : !vm.filter2;
            $state.go('cards.list',{retired:vm.filter2,page:vm.page+1})
        }else if(query===vm.filterList[3])
        {
            vm.filter3= vm.filter3=="false" ? true : !vm.filter3 ;
            $state.go('cards.list',{ordered:vm.filter3,page:vm.page+1})
        }else{
            vm.filter = query;
            $state.go('cards.list',{filter:vm.filter,page:vm.page+1})
        }
    }
    function changePage(query){
        if(!(query<vm.searchList.total_pages&&query>=0)&&vm.searchList.total_pages){
            UINotification.error("Please add a value between 0 and "+vm.searchList.total_pages);
            vm.loading = false;
            return;
        }
        vm.page = query;
        vm.text = query+1;
        $state.go('cards.list',{page:vm.page+1})
    }
    function nextCard(index,row){
        var current = {
            from:'cardList',
            filter:vm.filter,
            filter2:vm.filter2,
            filter3:vm.filter3,
            page:vm.page,
            id:index,
            row:row
        }
        Cards.setNext(current);
    }
    function approveCard(card){
        vm.loadingApprove = true;
        Cards.approveCard(card, card.visibility).then(function (res) {
            card.moderation = res.moderation;
            vm.loadingApprove = false;
            UINotification.success("card updated");            
        }).catch(function(err){
            vm.loadingApprove = false;
            UINotification.error(err.data.message);
        })
    }
}
]);