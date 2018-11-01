'use strict';

app.controller('orderListCtrl', ['$scope', 'Order','UINotification','Profile','CardVariation','$mdDialog','$state','$stateParams', 
                    function($scope,Order,UINotification,Profile,CardVariation,$mdDialog,$state,$stateParams) {
    var vm = this;
    vm.changePage=changePage;
    vm.changeFilter=changeFilter;
    vm.searchByProcoId=searchByProcoId;
    vm.searchByProcoItemId=searchByProcoItemId;
    vm.searchByCustomerId=searchByCustomerId;
    vm.searchByDate = searchByDate;
    vm.searchByFormat = searchByFormat;
    vm.searchByTransactionId = searchByTransactionId;
    vm.searchByAddress = searchByAddress;
    vm.buyerName = buyerName;
    vm.changeColor =changeColor;
    vm.refreshSearch = refreshSearch;
    vm.hasMore = hasMore;
    
    vm.cache = true;
    vm.searchList = {};
    vm.pages = [];
    vm.formats= [];
    vm.buyerList = [];
    vm.totalPages = 0;
    vm.searchBy =  ($stateParams.customerId||$stateParams.procoId||$stateParams.transactionId||$stateParams.recipient||$stateParams.postcode||$stateParams.procoItemId)?true:false;
    vm.page = $stateParams.page?parseInt($stateParams.page)-1:0;
    vm.text = vm.page+1;
    vm.loading = true;
    vm.ready = false;
    vm.filter = null;
    vm.format = $stateParams.format;
    vm.procoId  = null;
    vm.procoItemId = null;
    vm.customerId = null;
    vm.search = true;
    vm.today = new Date();
    vm.day = 24 * 60 * 60 * 1000;
    vm.tomorrow = new Date(new Date().getTime() +1*vm.day);
    vm.start_date = new Date(new Date().getTime() -7*vm.day);
    vm.end_date = vm.tomorrow;
    
    vm.filterList = [
        "UNPAID","PAID","REQUIRES_REFUND","REFUNDED","UNFIT_FOR_PRINT",
        "PRINTING_ERROR","SENT_TO_PRINTER","PRINTING","SENT"
    ]

    search();
    getSettings();

    function changePage(query){
        if(!(query<vm.searchList.total_pages&&query>=0)&&vm.searchList.total_pages){
            UINotification.error("Please add a value between 0 and "+vm.searchList.total_pages);
            vm.loading = false;
            return;
        }
        $state.go('users.orders',{page:query+1})

    }
    function getSettings(){
        CardVariation.getSettings().then(function(res){
            vm.formats = res.printer_format;
        })
    }
    function changeFilter(query){
        if (!query) {
            $state.go('users.orders',{},{inherit:false})

        } else {
            $state.go('users.orders',{filter:query},{inherit:false})
        }
    }
    function searchByFormat(){
        $state.go('users.orders',{format:vm.format},{inherit:false})
    }
    function searchByDate(){
        vm.filter = null;
        $state.go('users.orders',{},{inherit:false})
    }
    function searchByProcoId(){
        if(vm.procoId){  
            $state.go('users.orders',{procoId:vm.procoId},{inherit:false})
        }
    }
    function searchByTransactionId(){
        if(vm.transactionId){  
            $state.go('users.orders',{transactionId:vm.transactionId},{inherit:false})
        }
    }
    function searchByAddress(){
        if(vm.recipient||vm.postcode){  
            $state.go('users.orders',{recipient:vm.recipient,postcode:vm.postcode},{inherit:false})
        }
    }
    function searchByProcoItemId(){
        if(vm.procoItemId){
            $state.go('users.orders',{procoItemId:vm.procoItemId},{inherit:false})        
        }

    }
    function searchByCustomerId(){
        if(vm.customerId){
            $state.go('users.orders',{customerId:vm.customerId},{inherit:false})
        }   

    }
    function refresh(query){
        console.log("Total pages are ",query);
        vm.ready = true;
        vm.loading = false;
        vm.cache = true;
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
        }if(vm.search){
          vm.search=false;
          Profile.get(value).then(function(res){
            vm.buyerList.push(res);
            vm.search=true;
          })
        }
      }
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
    function search(){
        if($stateParams.customerId){
            vm.customerId = $stateParams.customerId;
            Order.searchByCustomerId(vm.customerId,vm.cache).then(function(res){
                vm.searchList= {};
                vm.searchList.orders= res;
                vm.searchList.total_pages = 1;
                refresh(vm.searchList.orders.length);
            }).catch(function(err) {
                console.log("Error can't find order");
                vm.searchList.total_pages = 0;
                vm.loading = false;
            });

        }
        else if($stateParams.procoId){
            vm.procoId=$stateParams.procoId;
            Order.searchByProcoId(vm.procoId,vm.cache).then(function(res){
                vm.searchList.orders= [res];
                vm.searchList.total_pages = 1;        
                refresh(vm.searchList.total_pages);
            }).catch(function(err) {
                console.log("Error can't find order");
                vm.searchList.total_pages = 0;
                vm.loading = false;
            });   
        }
        else if($stateParams.transactionId){
            vm.transactionId=$stateParams.transactionId;
            Order.searchByTransactionId(vm.transactionId,vm.cache).then(function(res){
                if(res)
                {
                    vm.searchList.orders= res;
                    vm.searchList.total_pages = 1;        
                    refresh(vm.searchList.total_pages);
                }
                else{
                    vm.searchList.total_pages = 0;
                    vm.loading = false;
                    vm.cache = false;
                }
            }).catch(function(err) {
                console.log("Error can't find order");
                vm.searchList.total_pages = 0;
                vm.loading = false;
            });   
        }
        else if($stateParams.recipient||$stateParams.postcode){
            vm.recipient=$stateParams.recipient;
            vm.postcode=$stateParams.postcode;
            var data = {recipient : vm.recipient,postcode: vm.postcode};
            Order.searchByAddress(data,vm.cache).then(function(res){
                if(res&&res.length)
                {
                    vm.searchList.orders= res;
                    vm.searchList.total_pages = 1;        
                    refresh(vm.searchList.total_pages);
                }
                else{
                    vm.searchList.total_pages = 0;
                    vm.loading = false;
                    vm.cache = false;
                }     
            }).catch(function(err) {
                console.log("Error can't find order");
                vm.searchList.total_pages = 0;
                vm.loading = false;
            });   
        }
        else if($stateParams.procoItemId){
            vm.procoItemId=$stateParams.procoItemId;
            Order.searchByProcoItemId(vm.procoItemId,vm.cache).then(function(res){
                vm.searchList= {};
                vm.searchList.orders= [res];        
                vm.searchList.total_pages=1;
                refresh(vm.searchList.total_pages);
            }).catch(function(err) {
                console.log("Error can't find order");
                vm.searchList.total_pages = 0;
                vm.loading = false;
            });
        }
        else  if($stateParams.filter){
            vm.filter=$stateParams.filter;
            Order.getFilter(vm.filter,vm.page,vm.cache).then(function(res){
                vm.searchList = res;
                console.log("Orders List",res);
                refresh(vm.searchList.total_pages);
            }).catch(function(err) {
                vm.totalPages=0;
                vm.loading = false;
            });
        }
        else{
            var params ={
                page_number : vm.page,
                start_date: vm.start_date.toISOString().slice(0,10),
                end_date: vm.end_date.toISOString().slice(0,10),
                format: vm.format,
            }
            Order.getAll(params,vm.cache).then(function(res){
                vm.searchList = res;
                console.log("Orders List",res);
                refresh(vm.searchList.total_pages);
            }).catch(function(err) {
                console.log("Something went wrong ", err);
                vm.totalPages=0;
                vm.loading = false;
            });
        }
    }
    function refreshSearch(){
        vm.cache = false;
        vm.loading = true;
        search();
    }
    function hasMore(list){
        var quantity = -1;
        list.map(function(x){
            quantity+=x.quantity;
        })
        return quantity;
    }
}
]);
