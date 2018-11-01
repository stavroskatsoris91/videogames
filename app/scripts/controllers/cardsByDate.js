app.controller('cardsByDateCtrl', ['Cards','UINotification','$mdDialog','$state','$stateParams', '$scope',
                    function(Cards,UINotification,$mdDialog,$state,$stateParams,$scope) {
    var vm = this;
    vm.groupBy = {};
    vm.getList = getList;
    vm.changeFilter = changeFilter;
    vm.changePage = changePage;
    vm.reload = reload;

    vm.searchList = {};
    vm.filter={};
    vm.loading = false;
    vm.times = 0;
    vm.filterList = [
        {
            name:"date",
            param: "date_ordered"
        },
        {
            name:"sales",
            param: "sales_ordered"
        },
        {
            name:"rank",
            param: "rank_ordered"
        }
    ];
    init();
    function init(){
        if($stateParams.date_ordered){
            vm.filter['date_ordered'] = $stateParams.type?$stateParams.date_ordered:'DESC';
        }
        else{
            vm.filter['date_ordered'] = 'DESC';
        }
        for(key in $stateParams){
            vm.filter[key] =  $stateParams[key];
        }
        vm.fromDate = $stateParams.from_date?new Date($stateParams.from_date):undefined;
        vm.toDate = $stateParams.to_date?new Date($stateParams.to_date):undefined;
        vm.dateType = $stateParams.date_type?$stateParams.date_type:'30_days';
        vm.page= $stateParams.page ? $stateParams.page-1 : 0;
        vm.text = vm.page+1;
        vm.params = angular.copy(vm.filter);
    }
    function getList(){
        if(!vm.fromDate){
            return;
        }
        vm.loading = true;
        vm.filter.page = vm.page;
        Cards.getListByDate(vm.fromDate,vm.toDate,vm.filter).then(function(res){
            vm.searchList = res;
            vm.loading = false;
            console.log(res);
        }).catch(function(err) {
            vm.loading = false;
        });
    }
    function changeFilter(filter){
        if(vm.filter[filter]=='DESC'){
            vm.filter[filter]='ASC';
        }else if(vm.filter[filter]=='ASC'){
            vm.filter[filter]=undefined;
        }
        else{
            vm.filter[filter]='DESC';
        }
        vm.params = Object.assign(vm.filter, {
            page:1,
            date_type:vm.dateType
        });
        reload();
    }
    function reload(){
        if(vm.times){
            vm.params.page = 1;
            vm.params.date_type = vm.dateType;
            vm.params.from_date = vm.fromDate.toISOString().slice(0,10);
            vm.params.to_date = vm.toDate.toISOString().slice(0,10);
            $state.go('cards.byDate',vm.params);
        }else{
            vm.times++;
            getList();
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
        $state.go('cards.byDate',{page:vm.page+1,date_type:vm.dateType})
    }
}
]);