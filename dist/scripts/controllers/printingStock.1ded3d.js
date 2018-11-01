app.controller('printingStockCtrl', ['Stats','Utils', '$mdDialog','$state','$stateParams', '$scope',
                    function(Stats,Utils,$mdDialog,$state,$stateParams,$scope) {
    var vm = this;
    vm.shipmentPerDay = [];
    vm.itemOptionStock = [];

    init();

    function init() {
      // Get all orders disptached by size and quantity
      Stats.getOrderBySize(new Date("2017-05-13T00:00:00Z"), new Date()).then(function (res) {
        aggregate(res);
      }).catch(function(err) {
        console.log("Error ",err);
      });

      Stats.getItemOptionStock().then(function(res) {
        console.log("Options are",res);
        vm.itemOptionStock = res;
      }).catch(function(err){
        console.log("Error ",err);
      });
      Stats.getDispatchLaterOrders().then(function(res){
        console.log("Dispatch Later",res);
        stockReportLater(res);
      }).catch(function(err){
        console.log("Error ",err);
      });
    }

    function aggregate(stockReport) {

      var shipmentPerDay = {};

      var greyEnvelopes = 0; //THORTFUL_ENV_GREY
      var greyEnvelopesLarge = 0; //THORTFUL_ENV_GREY_WALLET_KEEPSAKE
      var doNotBendSmall = 0; //THORTFUL_DNBEND_1-2
      var doNotBendLarge = 0; //THORTFUL_ENVELOPE_MANILLA 
      var c4Large = 0; //THORTFUL_ENV_GREY_HB_C4
      var eFlute =0; //THORTFUL_EFLUTE
      var boxA5 = 0; //THORTFUL_BOX_A5
      var notebookEnv = 0; //THORTFUL_NOTEBOOK_CARDBOARD_ENVELOPE
      var smallParcel = 0; //THORTFUL_NOTEBOOK_SMALL_PARCEL

      // stock as of 13/05
      // TODO, hold this in the API
      var greyEnvelopesStock = 29406 + 25500 + 25000 - 800 + 54150;
      var greyEnvelopesLargeStock = 5293;
      var doNotBendSmallStock = 7817 + 7401 + 5000 + 7480 + 4800 + 13400; // new delivery 30/05 + 07/06 + 9/06
      var doNotBendLargeStock = 1215 + 1236 + 2000 + 3075; // new delivery 30/05 + 07/06
      var c4LargeStock = 735 + 2000;    
      var eFluteStock = 868; 
      var boxA5Stock = 0;
      var notebookEnvStock =1317;
      var smallParcelStock=0;

      for (var i=0; i<stockReport.length; i++) {
        
        var day = stockReport[i].year + "/" + stockReport[i].month + "/" + stockReport[i].day;

        if (!shipmentPerDay[day]) {
          shipmentPerDay[day] = 0;
        }
        // Direct send -- no outer envelope
        switch (stockReport[i].format) {
          case "A5" :
            // Outer envelopes
            if (stockReport[i].recipient_type === "home_fill") {
              if (stockReport[i].size < 3) {
                doNotBendSmall += stockReport[i].num_orders;
              } else if (stockReport[i].size < 6) {
                doNotBendLarge += stockReport[i].num_orders;
              } else if (stockReport[i].num_orders < 19) {
                c4Large += stockReport[i].num_orders;
              } else if (stockReport[i].num_orders < 40){
                eFlute += stockReport[i].num_orders;
              } else {
                boxA5 += stockReport[i].num_orders;
              }
              shipmentPerDay[day] += stockReport[i].num_orders;
            } else {
              shipmentPerDay[day] += stockReport[i].num_orders * stockReport[i].size;
            }
            greyEnvelopes += stockReport[i].num_orders * stockReport[i].size;
            break;
          case "NOTEBOOK" :
            if (stockReport[i].size < 3) {
                  notebookEnv += stockReport[i].num_orders;
            } else if (stockReport[i].size < 6) {
              eFlute += stockReport[i].num_orders;
            } else{
              smallParcel += stockReport[i].num_orders;
            } 
            greyEnvelopesLarge += stockReport[i].num_orders * stockReport[i].size;
            shipmentPerDay[day] += stockReport[i].num_orders;
            break;
          case "SOCKS" :
            break;
        }
      }

      vm.greyEnvelopes = greyEnvelopesStock -  greyEnvelopes;
      vm.greyEnvelopesLarge = greyEnvelopesLargeStock - greyEnvelopesLarge;
      vm.doNotBendSmall = doNotBendSmallStock -  doNotBendSmall;
      vm.doNotBendLarge = doNotBendLargeStock - doNotBendLarge;
      vm.c4Large = c4LargeStock - c4Large;
      vm.eFlute = eFluteStock - eFlute;
      vm.boxA5 = boxA5Stock - boxA5;
      vm.notebookEnv = notebookEnvStock - notebookEnv;
      vm.smallParcel = smallParcelStock - smallParcel;

      var shipmentGraph =[];
      for (var key in shipmentPerDay) {
        shipmentGraph.push([new Date(key).getTime() + 12*60*60*1000,shipmentPerDay[key]])
      }
      vm.shipmentPerDay = shipmentGraph;
      console.log("Graph is ",shipmentGraph); 
    }
    function stockReportLater(report){
      var pendingStock = [];
      report.map(function(x){
        var newFormat = true;
        pendingStock.map(function(y){
          if(x.format===y.format&&x.item_option_name===y.item_option_name){
              y.stock += x.num_orders*x.size
              newFormat = false;
          }
        })
        if(newFormat){
          pendingStock.push({
            format : x.format,
            item_option_name : x.item_option_name,
            stock : x.num_orders*x.size
          })
        }
      })
      vm.pendingStock = pendingStock;
    }
}]);