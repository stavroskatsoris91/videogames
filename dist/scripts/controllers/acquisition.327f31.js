app.controller('acquisitionCtrl', ['Stats','Utils','$mdDialog','$state','$stateParams', '$scope',
                    function(Stats,Utils,$mdDialog,$state,$stateParams,$scope) {
    var vm = this;

    vm.reload = reload;
    vm.profiles = [];
    vm.buyers = [];

    init();

    function init () {
      vm.groupScale = 1;
    }


    function getData() {      
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
      // Stats.getProfilesCreated(vm.fromDate,vm.toDate).then(function(res){
      //   // populate the graph
      //   var graph =[];
      //   var total = 0;
      //   for (var i =0; i<res.length; i++ ) {
      //     report = res[i];
      //     var day = Utils.toJSDateString(report.year,report.month,report.day);
      //     graph.push([new Date(day).getTime(),report.count]);
      //     total += report.count;
      //   }
      //   vm.profiles = Utils.graphGroupBy(graph,vm.groupBy);
      //   vm.totalProfiles = total;
      // }).catch(function(err) {

      // })

      Stats.getProfilesRegistered(vm.fromDate,vm.toDate).then(function(res){
        var profiles =[];
        var buyers = [];
        var total = 0;
        var totalBuyersSameDay = 0;
        var totalBuyers = 0;

        for (var i =0; i<res.length; i++ ) {
          report = res[i];
          var day = Utils.toJSDateString(report.year,report.month,report.day);
          profiles.push([new Date(day).getTime(),report.count]);
          buyers.push([new Date(day).getTime(),report.count_buyer]);
          total += report.count;
          totalBuyersSameDay += report.count_buyer;
          totalBuyers += report.count_buyer + report.count_buyer_defer;
        }
        vm.profiles = Utils.graphGroupBy(profiles,vm.groupBy);
        vm.buyers = Utils.graphGroupBy(buyers,vm.groupBy);

        vm.totalProfiles = total;
        vm.totalBuyersSameDay = totalBuyersSameDay;
        vm.totalBuyers = totalBuyers;
      }).catch(function(err){

      })
    }

    function reload() {
      getData();
    }
  }
]);