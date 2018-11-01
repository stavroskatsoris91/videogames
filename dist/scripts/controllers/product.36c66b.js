app.controller('productCtrl', ['Stats','Utils', '$mdDialog','$state','$stateParams', '$scope',
                    function(Stats,Utils,$mdDialog,$state,$stateParams,$scope) {
    var vm = this;

    vm.dateType;
    vm.reload = reload;
    vm.cardSalesPerDay = [];
    vm.newUsersCardsSplit = [];

    init();

    function init () {
      vm.groupScale = 1;
      vm.cardsSales =[];
    }

    function getData() {

      var categoriesSales = {};
    
      Stats.getCategorySales(vm.fromDate,vm.toDate).then(function (res) {
          // looping on dates
        console.log("res",res);
        var total = 0;
        for (var i =0; i < res.length; i ++) {
              //looping on catgeories
            if (categoriesSales[res[i].category_name]) {
                categoriesSales[res[i].category_name] += res[i].count;
            } else {
                categoriesSales[res[i].category_name] = res[i].count;
            }

            total += res[i].count;  
        }
        console.log("total " + total);

        var categoriesArray = [];
        if (total > 0) {
            for (var key in categoriesSales) {
                var value = categoriesSales[key];
                categoriesArray.push({"title" : key,"count":categoriesSales[key]});
            } 

            categoriesArray.sort(function(a,b) {
                if (a.count < b.count) {
                    return 1;
                } else {
                    return -1;
                }
            });

            if (categoriesArray[0]) {
                vm.topSellingCategorie = categoriesArray[0].title;
                vm.topSellingCount = categoriesArray[0].count; 
            }
        }
        vm.categoriesSales = categoriesArray;
        console.log("Catgeory sales ",categoriesArray);
      });

      Stats.getCardSales(vm.fromDate,vm.toDate).then(function(res) {
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
            //Something bad happened
            console.log("Error ",err);
        })
    }


    function reload() {
      getData();
    }

    function populateGraph(weekData) {
        var cardSales = 0;
        var giftSales = 0;
        var cardSalesPerDay =[];
        var productSales = {};
        var count = 0;

        for (var k=0; k < weekData.length; k++ ){
            var cards = 0;
            var report = weekData[k];
            var day = Utils.toJSDateString(report.year,report.month,report.day);

            for (var i=0; i < report.sales.length; i++ ) {
                var row = report.sales[i];
                count = row.card_quantity*row.count;
                cards += count;

                // Card vs Gift split
                if (row.format == "A5"){
                    cardSales += count;
                } else {
                    giftSales += count;   
                }
                // Product breakdown
                if (!productSales[row.format]) {
                    productSales[row.format] = count;
                } else {
                    productSales[row.format] += count;
                }
            }
            cardSalesPerDay.push([new Date(day).getTime(),cards]);
        }
        vm.cardSales = cardSales;
        vm.giftSales = giftSales;
        vm.productSales = objToArray(productSales);

        vm.cardSalesPerDay = Utils.graphGroupBy(cardSalesPerDay,vm.groupBy);

    }
    function objToArray(obj) {
        var arr = [];
        for (var key in obj) {
            var value = obj[key];
            var newObj = {};
            newObj.product = key;
            newObj.count = value;
            arr.push(newObj);
        }

        arr.sort(function (a, b) {
            if (a.count < b.count) {
                return 1;
            } else {
                return -1;
            }
        });

        return arr;
    }
}]);