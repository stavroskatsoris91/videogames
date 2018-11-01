app.controller('orderStatusCtrl', ['Stats','Order','Utils','$mdDialog','$state','$stateParams', '$scope',
                    function(Stats,Order,Utils,$mdDialog,$state,$stateParams,$scope) {
    var vm = this;

    vm.reload = reload;
    vm.profiles = [];
    vm.statusList = Order.getStatusList();
    vm.status = vm.statusList[0];
    vm.orderStatsByStatus = orderStatsByStatus;

    init();

    function init () {
      vm.groupScale = 1;
    //   vm.excludeAmazon = true;
    }

    function getData() {
        Stats.getOrderCreatedStatus(vm.fromDate,vm.toDate).then(function(res) {
            if (res.length > 0) {
                console.log("card sales", res);
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
                populateGraph(res);
            }
        }).catch(function(err) {
            console.log("Error ", err);

        })
        orderStatsByStatus();
    }
    function orderStatsByStatus(){
        Stats.getOrderByStatus(vm.fromDate,vm.toDate,vm.status).then(function(res){
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

        for (var i=0; i<res.length; i++){
            var day = Utils.toJSDateString(res[i].year,res[i].month,res[i].day);
            count[day] = count[day]?count[day]+res[i].count:res[i].count;

        }
        for (var date in count) {
            countArray.push([new Date(date).getTime(),count[date]]);
        }
        vm.countArray = Utils.graphGroupBy(countArray,vm.groupBy);
    }


    function populateGraph(res) {
        
        var paid_count = {};
        var remaining_count = {};
        var sent_count = {};
        var sent_to_printer_count = {};

        for (var i=0; i<res.length; i++){
            var day = Utils.toJSDateString(res[i].year,res[i].month,res[i].day);
 
            paid_count[day] = paid_count[day]?paid_count[day]+res[i].paid_count:res[i].paid_count;

            remaining_count[day] = remaining_count[day]?remaining_count[day]+res[i].remaining_count:res[i].remaining_count;

            sent_count[day] = sent_count[day]?sent_count[day]+res[i].sent_count:res[i].sent_count;

            sent_to_printer_count[day] = sent_to_printer_count[day]?sent_to_printer_count[day]+res[i].sent_to_printer_count:res[i].sent_to_printer_count;

        }

        var paid_countArray = [];
        var remaining_countArray = [];
        var sent_countArray = [];
        var sent_to_printer_countArray = [];

        for (var date in paid_count) {
            paid_countArray.push([new Date(date).getTime(),paid_count[date]]);
        }
        for (var date in remaining_count) {
            remaining_countArray.push([new Date(date).getTime(),remaining_count[date]]);
        }
        for (var date in sent_count) {
            sent_countArray.push([new Date(date).getTime(),sent_count[date]]);
        }
        for (var date in sent_to_printer_count) {
            sent_to_printer_countArray.push([new Date(date).getTime(),sent_to_printer_count[date]]);
        }

        vm.paid_countArray = Utils.graphGroupBy(paid_countArray,vm.groupBy);
        vm.remaining_countArray = Utils.graphGroupBy(remaining_countArray,vm.groupBy);
        vm.sent_countArray = Utils.graphGroupBy(sent_countArray,vm.groupBy);
        vm.sent_to_printer_countArray = Utils.graphGroupBy(sent_to_printer_countArray,vm.groupBy);        
    }

    function reload() {
      getData();
    }

  }
]);