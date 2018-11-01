app.controller('dashboardCtrl', ['Stats','$q','$mdDialog','$state','$stateParams', 
                    function(Stats,$q,$mdDialog,$state,$stateParams) {

    var vm = this;
    vm.dataReady = false;
    init();
    
    function init () {
        
        vm.order_new_perc =0;
        vm.cards_new_perc =0;

        var endDate = new Date();
        var startDate = new Date(new Date().getTime() - 7* 24 * 60 * 60 * 1000);
        //var startDateMD = new Date(new Date().getTime() - 98* 24 * 60 * 60 * 1000);
        console.log("Loading data for ",startDate,endDate);
        Stats.getCardSales(startDate,endDate).then(function(res) {
            console.log("res is ", res);
            if (res.length > 0) {
                populateDailyNumbers(res[0]);
                //populateGraph(res);   

                vm.dataReady=true;
            }
         }).catch(function(err) {
             //Something bad happened
             console.log("Error ",err);
         })
         Stats.getTransactionSales(startDate,endDate).then(function(res) {
            console.log(res);
            if (res.length > 0) {
                var group = groupByDate(res);
                populateDailyTransactions(group[0],group[1]);
                populateTransactionsGraph(group);   

                vm.transactionsReady=true;
            }
        }).catch(function(err) {
            //Something bad happened
           // transactionPromise.reject("Error");
        })
         let startPromise = $q.defer();
         let endPromise = $q.defer();
         let allPromises = [startPromise.promise,endPromise.promise];
         getHourlySales(startDate,startDate,startPromise);
         getHourlySales(endDate,endDate,endPromise);
         $q.all(allPromises).then(function(res){
            vm.start = res[0];
            vm.end = res[1];
         })
         
    }
    function groupByDate(data){
        var group = [];

        for(var i=0; i<data.length;i++){
            var newDate = true;
            group.map(function(x){
                if(x.year===data[i].year&&x.month===data[i].month&&x.day===data[i].day){
                    x.transactions.push(data[i]);
                    newDate = false;
                }
            })
            if(newDate){
                var y = 0;
                for(y; y<group.length;y++){
                    if(group[y].year < data[i].year){
                        break;
                    }else if(group[y].year==data[i].year){
                        if(group[y].month < data[i].month){
                            break;
                        }else if(group[y].month==data[i].month){
                            if(group[y].day < data[i].day){
                                break;
                            }
                        }
                    }
                }
                group.splice(y,0,{
                    year: data[i].year,
                    month: data[i].month,
                    day: data[i].day,
                    transactions: [data[i]]});
            }
        }
        return group;
    }
    function populateDailyTransactions(day,yesterday) {
        var report = day;

        console.log(day);
        var total = 0;
        var new_transactions = 0;
        var new_cards = 0;
        var returning_transactions = 0;
        var returning_cards = 0;
        var new_transactions_yesterday = 0;
        var returning_transactions_yesterday = 0;

        for (var i=0; i<day.transactions.length; i ++) {
            var row = day.transactions[i];
            if (row.new_user) {
                new_cards += row.card_quantity * row.number_transaction;
                new_transactions += row.number_transaction;
            } else {
                returning_cards += row.card_quantity * row.number_transaction;
                returning_transactions += row.number_transaction;
            }
            total += row.number_transaction * row.card_quantity;
        }

        
        for (var i=0; i<yesterday.transactions.length; i ++) {
            var row = yesterday.transactions[i];
            if (row.new_user) {
                new_transactions_yesterday += row.number_transaction;
            } else {
                returning_transactions_yesterday += row.number_transaction;
            }
        }
        vm.yesterday_transactions_new = new_transactions_yesterday;
        vm.yesterday_transactions_returning = returning_transactions_yesterday;

        vm.transactions_new = new_transactions;
        vm.transactions_returning = returning_transactions;
        vm.cards_new = new_cards;

        vm.transactions = new_transactions + returning_transactions;
        vm.cards = new_cards + returning_cards;

        if (vm.transactions > 0) {
            vm.transaction_new_perc = new_transactions / vm.transactions * 100;
        }

        if (vm.cards > 0) {
            vm.cards_new_perc = new_cards / vm.cards * 100;
        }
        total += row.count * row.card_quantity;
    }
    function populateDailyNumbers(day) {
        var report = day;

        console.log(day);

        //var cardSales = 0;
        //var keepsakeSales = 0;
        //var socksSales = 0;
        //var chocolateSales = 0;
        var itemSales = {};
        var total = 0;
        //var new_orders = 0;
        //var new_cards = 0;
        //var returning_orders = 0;
        //var returning_cards = 0;

        // Andy's report
        var andyTable = [];
       

        for (var i=0; i<day.sales.length; i ++) {
            var row = day.sales[i];
            // if (row.new_user) {
            //     new_cards += row.card_quantity * row.count;
            //     new_orders += row.count;
            // } else {
            //     returning_cards += row.card_quantity * row.count;
            //     returning_orders += row.count;
            // }

            if(itemSales[row.format]){
                itemSales[row.format] += row.count * row.card_quantity;
            }
            else{
                itemSales[row.format] = row.count * row.card_quantity;
            }
            // if (row.format == "A5") {
            //     cardSales += row.count * row.card_quantity;
            // } else if (row.format == "NOTEBOOK") {
            //     keepsakeSales += row.count * row.card_quantity;
            // } else if (row.format == "SOCKS") {
            //     socksSales += row.count * row.card_quantity;
            // } else {
            //     chocolateSales += row.count * row.card_quantity;
            // }
            total += row.count * row.card_quantity;
            andyTable = addToAndySReport(andyTable,row);
        }

        vm.andyTable = andyTable;
        //vm.orders_new = new_orders;
        //vm.cards_new = new_cards;

        //vm.orders = new_orders + returning_orders;
        //vm.cards = new_cards + returning_cards;

        // if (vm.orders > 0) {
        //     vm.order_new_perc = new_orders / vm.orders * 100;
        // }

        // if (vm.cards > 0) {
        //     vm.cards_new_perc = new_cards / vm.cards * 100;
        // }
        vm.plot_pie = [];
        for(item in itemSales){
            vm.plot_pie.push({
                label: item[0].toUpperCase()+item.slice(1).toLowerCase()+" (" + itemSales[item] + ")",
                data: (itemSales[item]) / (total) *100
                })
        }
        // vm.plot_pie[0] = {
        //     label: "KeepSake (" + keepsakeSales + ")",
        //     data: (keepsakeSales) / (cardSales+keepsakeSales+socksSales+chocolateSales) *100
        //     }
        // vm.plot_pie[1] = {
        //         label: "Card  (" + cardSales + ")",
        //         data: (cardSales) / (cardSales+keepsakeSales+socksSales+chocolateSales) *100
        //     } 
        // vm.plot_pie[2] = {
        //     label: "Socks  (" + socksSales + ")",
        //     data: (socksSales) / (cardSales+keepsakeSales+socksSales+chocolateSales) *100
        // } 
        // vm.plot_pie[3] = {
        //     label: "Chocolate  (" + chocolateSales + ")",
        //     data: (chocolateSales) / (cardSales+keepsakeSales+socksSales+chocolateSales) *100
        // } 
    }

    // function populateGraph(weekData) {
    //     var orders = 0;
    //     var cards = 0;
    //     var plot1 = [];
    //     var plot2 = [];

    //     for (var k=0; k < weekData.length; k++ ){
    //         orders = 0;
    //         cards = 0;
    //         var report = weekData[k];
    //         var day = report.year + "/" + report.month + "/" + report.day;
            
    //         for (var i=0; i < report.sales.length; i++) {
    //             var row = report.sales[i];
    //             cards += row.count * row.card_quantity;
    //             orders += row.count;
    //         }

    //         var dayDataOrders = [new Date(day).getTime(),orders];
    //         var dayDataCards = [new Date(day).getTime(),cards];

    //         plot1.push(dayDataOrders);
    //         plot2.push(dayDataCards);
    //     }
    //     vm.plot_line = plot1;
    // }
    function populateTransactionsGraph(weekData) {
        var transactions = 0;
        var cards = 0;
        var plot1 = [];
        var plot2 = [];

        for (var k=0; k < weekData.length; k++ ){
            transactions = 0;
            cards = 0;
            var report = weekData[k];
            var day = report.year + "/" + report.month + "/" + report.day;
            
            for (var i=0; i < report.transactions.length; i++) {
                var row = report.transactions[i];
                cards += row.number_transaction * row.card_quantity;
                transactions += row.number_transaction;
            }

            var dayDataTransactions = [new Date(day).getTime(),transactions];
            var dayDataCards = [new Date(day).getTime(),cards];

            plot1.push(dayDataTransactions);
            plot2.push(dayDataCards);
        }
        vm.plot_line = plot1;
    }
    function addToAndySReport(array,newRow) {
        var result = [];
        var grouped = false;
        console.log("Array :",array);

        if (array && array.length > 0) {
            array.forEach(function(row){
                if (row.format === newRow.format && row.new_user == newRow.new_user) {
                    console.log("Grouping",newRow);
                    row.orders += newRow.count;
                    row.cards += newRow.card_quantity*newRow.count;
                    grouped = true;
                }
                result.push(row);
            });
        } 
        if (!grouped) {
            var data = {
                "format" : newRow.format,
                "new_user" : newRow.new_user,
                "orders" : newRow.count,
                "cards" : newRow.count * newRow.card_quantity
            }
            result.push(data);
        }

        return result;
    }
    function hourlyReporty(res,promise){
        var cards = {};
        for(var hour = 0; hour <24 ; hour++){
            cards[hour] = 0;
        }
        for(var i =0; i < res.length; i++){
            cards[res[i].hour] = res[i].card_count;
        }
        var array =[];
        for (var hour in cards) {
            array.push([hour,cards[hour]]);
        }
        promise.resolve(array);
    }
    function getHourlySales(startDate,endDate,promise){
        Stats.getHourlySales(startDate,endDate).then(function(res){
                console.log("Daily res is ", res);
                 hourlyReporty(res,promise);          
            }).catch(function(err){
                //Something bad happened
                console.log("Error ",err);
                promise.reject("Error");
                
            })
    }
}]);