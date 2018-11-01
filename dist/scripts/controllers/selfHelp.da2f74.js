app.controller('selfHelpCtrl', ['$scope','Stats','Utils', 'Order','UINotification','Profile','CardVariation','$mdDialog','$state','$stateParams', 
function($scope,Stats,Utils,Order,UINotification,Profile,CardVariation,$mdDialog,$state,$stateParams) {
    var vm = this;
    vm.getList = getList;
    vm.changeFilter = changeFilter;
    vm.changePage = changePage;
    vm.reload = reload;
    vm.hasMore = hasMore;
    vm.changeColor = changeColor;
    vm.buyerName = buyerName;
    vm.groupScale = 1;

    vm.searchList = {};
    vm.filter={};
    vm.loading = false;
    vm.buyerList=[];
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
        //if($stateParams.status){
        //    vm.filter['status'] = $stateParams.status;
        //}
        // for(key in $stateParams){
        //     vm.filter[key] =  $stateParams[key];
        // }
        vm.filter['order_status'] = "CUSTOMER_REPRINT";
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
        vm.filter.page_number = vm.page;
        Order.getAllHistory(vm.fromDate,vm.toDate,vm.filter).then(function(res){
            vm.searchList = res;
            vm.loading = false;
            console.log(res);
        }).catch(function(err) {
            vm.loading = false;
        });
        orderStatsByStatus();
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
            $state.go('app.selfHelp',vm.params);
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
    function hasMore(list){
        var quantity = -1;
        list.map(function(x){
            quantity+=x.quantity;
        })
        return quantity;
    }
    function changeColor(query,type){
        switch(query) {
        case "UNPAID":
        case "PRINTING_ERROR":
        case "UNFIT_FOR_PRINT":
        case "UNDELIVERED":
        return type+"-danger";
        case "PAID":
        case "SENT_TO_PRINTER":
        case "SENT":
        case "DELIVERED":
        return type+"-success";
        default:
        return type+"-warning";
        }
    }
    function buyerName(value){
        var report =[];
      if(value){
        for(var i in vm.buyerList)
        {
          if(value===vm.buyerList[i].id)
          {
            if(vm.buyerList[i].contact.firstname){
            report.push(vm.buyerList[i].contact.firstname + " "+ vm.buyerList[i].contact.surname);
            }else{
                report.push("Private Name");
            }
            var reg = new Date(vm.buyerList[i].created_at_gmt)
            report.push("Registered Date: "+reg.getDate()+"/"+(reg.getMonth()+1)+"/"+reg.getFullYear());
            report.push("Total Orders: "+vm.buyerList[i].profile_report.paid_orders);
            report.push("Total Spent: £"+(vm.buyerList[i].profile_report.total_spent?vm.buyerList[i].profile_report.total_spent.toFixed(2):0));
            // report.push("Paid Cards: "+vm.buyerList[i].profile_report.paid_cards_quantity);
            if(vm.buyerList[i].profile_report.num_referral_orders){
                report.push("Reffere Orders: "+vm.buyerList[i].profile_report.num_referral_orders);
            }
            return report;
            
          }
        }if(!vm.search){
          vm.search=true;
          Profile.get(value).then(function(res){
            vm.buyerList.push(res);
            vm.search=false;
          })
        }
      }
    }
    function orderStatsByStatus(){
        Stats.getOrderByStatus(vm.fromDate,vm.toDate,'CUSTOMER_REPRINT').then(function(res){
            switch(vm.groupBy) {
                case 'day':
                    vm.groupScale = 1;
                    break;
                case 'week' :
                    vm.groupScale = 7;
                    break;
                case 'month':
                    vm.groupScale = 30;
                    break;
              }
            populateStatusGraph(res);
       })
    }
    function populateStatusGraph(res){
        
        var count = {};
        var countArray = [];
        var total_orders = 0;
        for (var i=0; i<res.length; i++){
            var day = Utils.toJSDateString(res[i].year,res[i].month,res[i].day);
            count[day] = count[day]?count[day]+res[i].count:res[i].count;
            total_orders+=res[i].count;

        }
        for (var date in count) {
            countArray.push([new Date(date).getTime(),count[date]]);
        }
        vm.total_orders = total_orders;
        vm.countArray = Utils.graphGroupBy(countArray,vm.groupBy);
    }
}
]);