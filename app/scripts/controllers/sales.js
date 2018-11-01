app.controller('salesCtrl', ['Stats','Utils','$q','$mdDialog','$state','$stateParams', '$scope',
                    function(Stats,Utils,$q,$mdDialog,$state,$stateParams,$scope) {
    var vm = this;

    vm.reload = reload;

    vm.dataReady = false;
    vm.refresh = false;
    vm.denominator = null;
    vm.numerator = null;

    init();

    function init () {
      vm.groupScale = 1;
      vm.oneDay = 86400000;
      vm.order_new_perc =0;
      vm.cards_new_perc =0;
      //vm.ordersPerDay = [];
      //vm.ordersPerDayGraph = [];
      vm.newPerDay =[];
      vm.excludeAmazon = true;
    }

    function reload() {
        console.log("Amazon Excluded ",vm.excludeAmazon);
        getData();
    }

    function getData() {       
        //TODO: All that should be in a directive wrapping the plot directive
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
        // let orderPromise = $q.defer();
        // let transactionPromise = $q.defer();
        // let allPromises = [orderPromise.promise,transactionPromise.promise];

        Stats.getOrderSales(vm.fromDate,vm.toDate).then(function(res) {
            formatOrderData(res);
        }).catch(function(err) {
            //orderPromise.reject("Error");
            //Something bad happened
        })

        // Stats.getCardSales(vm.fromDate,vm.toDate).then(function(res) {
        //     formatCardData(res);
        // }).catch(function(err) {
        //     //Something bad happened
        // })

        Stats.getTransactionSales(vm.fromDate,vm.toDate).then(function(res) {
            formatTransactionData(res);
        }).catch(function(err) {
            //Something bad happened
            //transactionPromise.reject("Error");
        })

        // $q.all(allPromises).then(function(res) {
        //     averageValue(res[0],res[1]);
        // })
    }

    function formatTransactionData(res) {
        var totalCards = 0;
        var totalAmount = 0;
        var totalNewAmount = 0;
        var totalReturningAmount = 0;
        var aggregatedDay = {};
        var transactionsArray = [];
        var transactionArrayNew = [];

        var transactionSizeNew = {};
        var transactionSizeReturning = {};
        var totalNew = 0;
        var totalReturning = 0;
        var transactionsPerDay = {};
        var valuePerDay = {};
        var newPerDay = {};

        for (var i = 0; i < res.length; i ++ ) {
            if (vm.excludeAmazon && res[i].campaign_name == "Amazon100") {
                continue;
            }
            var day = Utils.toJSDateString(res[i].year,res[i].month,res[i].day);
            
            var range = sizeToRange(res[i].card_quantity);
            totalAmount += res[i].final_cost;
            if (!aggregatedDay[day]) {
                aggregatedDay[day] = {};
                aggregatedDay[day].cards = 0;
                aggregatedDay[day].transactions = 0;
            }
            aggregatedDay[day].cards += res[i].card_quantity * res[i].number_transaction;
            aggregatedDay[day].transactions += res[i].number_transaction;

            if(res[i].new_user){
                totalNew+=res[i].number_transaction;
                totalNewAmount+=res[i].final_cost;
                if (transactionSizeNew[range]) {
                    transactionSizeNew[range] += res[i].number_transaction; 
                } else {
                    transactionSizeNew[range] = res[i].number_transaction;
                }
                if (newPerDay[day]) {
                    newPerDay[day] += res[i].number_transaction;
                } else {
                    newPerDay[day] = res[i].number_transaction;
                }
            } else {
                totalReturning+=res[i].number_transaction;
                totalReturningAmount+=res[i].final_cost;
                if (transactionSizeReturning[range]) {
                    transactionSizeReturning[range] += res[i].number_transaction; 
                } else {
                    transactionSizeReturning[range] = res[i].number_transaction;
                }
                if (!newPerDay[day]) {
                    newPerDay[day] = 0;
                }
            }
            if (valuePerDay[day]) {
                valuePerDay[day] += res[i].final_cost;
            } else {
                valuePerDay[day] = res[i].final_cost;
            }
        }
        for(day in newPerDay){
            var j =0;
            for(j;j<transactionArrayNew.length;j++){
                if(transactionArrayNew[j][0]>new Date(day).getTime())
                {
                    break;
                }
            }
            transactionArrayNew.splice(j,0,[new Date(day).getTime(),newPerDay[day]]);
        }
        vm.transactionArrayNewPerDayGraph = Utils.graphGroupBy(transactionArrayNew,vm.groupBy);
        var valueArray = [];
        for (var date in valuePerDay) {
            valueArray.push([new Date(date).getTime(),valuePerDay[date]]);
        }
        vm.valuePerDay = Utils.graphGroupBy(valueArray,vm.groupBy);
        console.log('trans list:',vm.valuePerDay);     
        for(day in aggregatedDay){
            var j =0;            
            for(j;j<transactionsArray.length;j++){
                if(transactionsArray[j][0]>new Date(day).getTime())
                {
                    break;
                }
            }
            transactionsArray.splice(j,0,[new Date(day).getTime(),aggregatedDay[day].transactions]);
        }
        vm.totalSales = totalAmount;
        console.log('transactions amount:',totalAmount);
        vm.transactionsPerDayGraph = Utils.graphGroupBy(transactionsArray,vm.groupBy);
        //promise.resolve(vm.transactionsPerDayGraph);
        averageValue(vm.valuePerDay,vm.transactionsPerDayGraph);
        transactionSizeNew["Total"] = totalNew;
        transactionSizeReturning["Total"] = totalReturning;
        vm.transactionSizeNew = objToArray(transactionSizeNew);
        vm.transactionSizeReturning = objToArray(transactionSizeReturning);
        vm.totalTransactions = totalNew+totalReturning;
        console.log("Transaction size new",vm.transactionSizeNew);
        console.log("Transaction size retruing",vm.transactionSizeReturning);
        vm.user_type = [];
        vm.user_type[0] = {
            label: "New",
            data: totalNew / (totalReturning+totalNew) *100
            }
        vm.user_type[1] = {
                label: "Returning",
                data: totalReturning / (totalReturning+totalNew) *100
            }
        vm.basketValue = vm.totalTransactions?totalAmount / vm.totalTransactions:0;
        vm.newUserBasketValue = totalNew?totalNewAmount / totalNew:0;
        vm.returningUserBasketValue = totalReturning?totalReturningAmount / totalReturning:0;
    }
    function averageValue(numerator,denominator){
        var average = [];
        denominator.map(function(x){
            numerator.map(function(y){
                if(x[0]===y[0]){
                    average.push([x[0],x[1]?y[1]/x[1]:0]);
                }
            })
        })
        average.sort();
        for(i=0;i<average.length;i++){
            if(average[i+1]&&average[i+1][0]>(average[i][0]+vm.oneDay*vm.groupScale)){
                average.splice(i+1,0,[average[i][0]+vm.oneDay*vm.groupScale,0])
            }
        }
        vm.averagePerDayGraph = Utils.graphGroupBy(average,vm.groupBy);
    }
    function formatOrderData(res) {
        var total =0;
        //var totalOrders = 0;
        var home_fill = 0;
        var home_fill_value = 0;
        var home_fill_new_user = 0;
        var home_fill_new_user_value = 0;
        var home_fill_returning_user = 0;
        var home_fill_returning_user_value = 0;
        var new_user_value = 0;
        var returning_user_value = 0;
        var order_count=0;
        //var ordersPerDay = {};
        var valuePerDay = {};
        var newPerDay = {};


        for (var i=0; i<res.length; i++){
            var day = Utils.toJSDateString(res[i].year,res[i].month,res[i].day);
            if (vm.excludeAmazon && res.campaign_name == "Amazon100") {
                continue;
            }
            total += res[i].amount;
            if (res[i].recipient_type == "home_fill") {
                home_fill += res[i].order_count;
                home_fill_value += res[i].amount;
                if(res[i].new_user){
                    home_fill_new_user += res[i].order_count;
                    home_fill_new_user_value += res[i].amount;
                }else{
                    home_fill_returning_user += res[i].order_count;
                    home_fill_returning_user_value += res[i].amount;
                }
            }
            if (res[i].new_user) {
                new_user_value += res[i].amount;
                if (newPerDay[day]) {
                    newPerDay[day] += res[i].order_count;
                } else {
                    newPerDay[day] = res[i].order_count;
                }
            }else{
                returning_user_value += res[i].amount;
            }
            order_count += res[i].order_count;
            
            if (valuePerDay[day]) {
                valuePerDay[day] += res[i].amount;
            } else {
                valuePerDay[day] = res[i].amount;
            }
        }
        
        var newArray = [];
        for (var date in newPerDay) {
            newArray.push([new Date(date).getTime(),newPerDay[date]]);
        }
        var valueArray = [];
        for (var date in valuePerDay) {
            valueArray.push([new Date(date).getTime(),valuePerDay[date]]);
        }


        vm.newPerDay = newArray;
        
        vm.valuePerDay2 = Utils.graphGroupBy(valueArray,vm.groupBy);
        console.log('order list:',vm.valuePerDay2);     
        

        vm.order_type = [];
        vm.order_type[0] = {
            label: "Home fill",
            data: home_fill / order_count *100
            }
        vm.order_type[1] = {
                label: "Direct Send",
                data: (order_count - home_fill) / order_count *100
            }
        vm.totalSales2 = total;
        console.log('order amount:',total);
        vm.homeFillBasketValue = home_fill?home_fill_value / home_fill:0;
        vm.homeFillNewUserBasketValue = home_fill_new_user?home_fill_new_user_value / home_fill_new_user:0;
        vm.homeFillReturningUserBasketValue = home_fill_returning_user?home_fill_returning_user_value / home_fill_returning_user:0;
    }

    function objToArray(obj) {
        var arr = [];
        for (var key in obj) {
            var value = obj[key];
            var newObj = {};
            newObj.size = key;
            newObj.count = value;
            arr.push(newObj);
      } 

      arr.sort(function(a,b) {
        if (a.size < b.size) {
            return -1;
        } else {
            return 1;
        }
      });

      return arr;
    }

    function sizeToRange(size) {
        if (size > 10) {
            return "11+";
        } else {
            return size.toString();
        }
    }
}]);