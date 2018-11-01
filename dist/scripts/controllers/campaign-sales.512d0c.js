app.controller('campaignSalesCtrl', ['Stats','Utils','$mdDialog','$state','$stateParams', '$scope',
                    function(Stats,Utils,$mdDialog,$state,$stateParams,$scope) {
    var vm = this;

    vm.reload = reload;
    vm.profiles = [];

    init();

    function init () {
      vm.groupScale = 1;
      vm.excludeAmazon = true;
    }

    function getData() {
        Stats.getTransactionSales(vm.fromDate,vm.toDate).then(function(res) {
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
    }


    function populateGraph(weekData) {

        var campaignStats = {};
        var dayCampaignStats = {};
        
        for (var k=0; k < weekData.length; k++ ){
            var cards = 0;
            var transactions = 0;
            var report = weekData[k];
            var day = Utils.toJSDateString(report.year,report.month,report.day);
            var report = report;

            if (vm.excludeAmazon && report.campaign_name == "Amazon100") {
                continue;
            }
            cards += report.number_transaction * report.card_quantity;
            transactions += report.number_transaction;
            if (!report.campaign_name) {
                report.campaign_name = "No Discount";
            }
            
            if (campaignStats[report.campaign_name]) {
                campaignStats[report.campaign_name].cards += report.number_transaction * report.card_quantity;
                campaignStats[report.campaign_name].transactions += report.number_transaction;
            } else {
                campaignStats[report.campaign_name] = {};
                campaignStats[report.campaign_name].cards = report.number_transaction * report.card_quantity;
                campaignStats[report.campaign_name].transactions = report.number_transaction;
            }
        }
        vm.campaignStats = Utils.objectToObjectArray("campaign_name",campaignStats);
    }

    function reload() {
      getData();
    }

  }
]);