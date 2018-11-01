app.controller('customerServiceCtrl', ['Stats', 'Utils','Pricing', '$q', '$mdDialog', '$state', '$stateParams', '$scope',
    function (Stats, Utils,Pricing, $q, $mdDialog, $state, $stateParams, $scope) {
        var vm = this;

        vm.reload = reload;

        vm.dataReady = false;
        vm.refresh = false;
        vm.zones=[];
        var obj = {
            count : 0,
            q1:{
                count : 0,
                zone_1 : 0,
                zone_2 : 0,
                zone_3 : 0,
            },
            q2 : {
                count : 0,
                zone_1 : 0,
                zone_2 : 0,
                zone_3 : 0,
                },
            q3 : {
                count : 0,
                zone_1 : 0,
                zone_2 : 0,
                zone_3 : 0,
                },
            q4to10 : {
                count : 0,
                zone_1 : 0,
                zone_2 : 0,
                zone_3 : 0,
                },
            q11plus : {
                count : 0,
                zone_1 : 0,
                zone_2 : 0,
                zone_3 : 0,
                },
            zone_1 : 0,
            zone_2 : 0,
            zone_3 : 0,
        }



        init();

        function init() {
            vm.groupScale = 1;
            vm.excludeAmazon = true;
        }

        function reload() {
            console.log("Amazon Excluded ", vm.excludeAmazon);
            getData();
        }

        function getData() {
            //TODO: All that should be in a directive wrapping the plot directive
            switch (vm.groupBy) {
                case 'day':
                    vm.groupScale = 1;
                    break;
                case 'week':
                    vm.groupScale = 7;
                    break;
                case 'month':
                    vm.groupScale = 30;
                    break;
            }
            Stats.getUndeliveredOrders(vm.fromDate,vm.toDate).then(function(res) {
                getUndeliveredOrders(res);
            }).catch(function(err) {
                //Something bad happened
            })
            Stats.getOrderBySize(vm.fromDate,vm.toDate).then(function (res) {
                if(!vm.zones.length){
                    Pricing.getDeliveryTime().then(function (delivery) {
                        vm.zones = editZones(delivery);
                        aggregate(res);
                    })
                }else{
                    aggregate(res);
                }
              }).catch(function(err) {
                console.log("Error ",err);
              });
        }
        function editZones(delivery){
            var zones = [];
            delivery.map(function(x){
                if(x.dispatch_type=='IMMEDIATE'&&x.enabled){
                    zones.push({countries : x.countries,
                        min_days:x.min_days
                    })
                }
            })
            zones.sort(function (a, b) {
                if (a.min_days > b.min_days) {
                    return 1;
                } else {
                    return -1;
                }
            });
            return zones;
        }
        function getUndeliveredOrders(res) {
            
            var totalOrders = 0;
            var totalAmount = 0;
            var order = {};
            var amount = {};
            var undeliveredPerFormat = {};

            console.log(res);
            order[vm.fromDate] = null;
            order[vm.toDate] = null;
            amount[vm.fromDate] = null;
            amount[vm.toDate] = null;
             for (var i = 0; i < res.length; i++) {
                var day = Utils.toJSDateString(res[i].year,res[i].month,res[i].day);
                if(!order[day]){
                     order[day] = res[i].num_orders;
                     amount[day] = res[i].order_final_amount;
                }
                else {
                    order[day] += res[i].num_orders;
                    amount[day] += res[i].order_fianl_amount;
                }
                totalOrders += res[i].num_orders;
                totalAmount += res[i].order_final_amount;

                if (!undeliveredPerFormat[res[i].format]) {
                    undeliveredPerFormat[res[i].format] = res[i].num_orders;
                } else {
                    undeliveredPerFormat[res[i].format] += res[i].num_orders;
                }
            }
            vm.undeliveredPerFormat = undeliveredPerFormat;

            var ordersArray = [];
            for (var date in order) {
                ordersArray.push([new Date(date).getTime(),order[date]]);
            }
            var amountArray = [];
            for (var date in amount) {
                amountArray.push([new Date(date).getTime(),amount[date]]);
            }

            vm.ordersPerDayGraph = Utils.graphGroupBy(ordersArray,vm.groupBy);
            vm.amountPerDayGraph = Utils.graphGroupBy(amountArray,vm.groupBy);
            vm.totalOrders = totalOrders;
            vm.totalAmount = totalAmount;

        }
        
    function aggregate(stockReport) {
    
        var shipmentPerDay = {};
        var shipmentPerFormat = {};
        var shipmentHome = {};
        var shipmentAway = {};
        var totalShipments = 0;
        shipmentPerDay[vm.fromDate] = null;
        shipmentPerDay[vm.toDate] = null;

        var procoCost = 0;

        for (var i=0; i<stockReport.length; i++) {
            var row = stockReport[i];
            var day = Utils.toJSDateString(row.year,row.month,row.day);

            if (!shipmentPerDay[day]) {
                shipmentPerDay[day] = row.num_orders;
            } else {
                shipmentPerDay[day] += row.num_orders;
            }
            totalShipments += row.num_orders;

            // Adding the shipment per Format and recipient type
            if (!shipmentPerFormat[row.format]) {
                shipmentPerFormat[row.format] = {};
                shipmentPerFormat[row.format].direct_send = 0;
                shipmentPerFormat[row.format].home_fill = 0;
                if (row.recipient_type == "direct_send") {
                    shipmentPerFormat[row.format].direct_send = row.num_orders;
                    populateProducts(shipmentAway,row);
                } else {
                    populateProducts(shipmentHome,row);
                    shipmentPerFormat[row.format].home_fill = row.num_orders;
                }
            } else {
                if (row.recipient_type == "direct_send") {
                    populateProducts(shipmentAway,row);
                    shipmentPerFormat[row.format].direct_send += row.num_orders;
                } else {
                    populateProducts(shipmentHome,row);
                    shipmentPerFormat[row.format].home_fill += row.num_orders;
                }
            }


            // crunching the proco cost 
            // 29p/card + 10p/order
            // 59p box and 2.25 notebook
            procoCost += row.num_orders*.1;
            
            var item_cost = .29;
            switch (row.format) {
                case "A5":
                case "A5_SECRET":
                    item_cost = .29;
                    break;
                case "NOTEBOOK":
                    item_cost = 2.25;
                    break;    
                default:
                    item_cost = .49;                         
            }
            procoCost += row.num_orders * row.size*item_cost;
        }
        var shipmentGraph =[];
        for (var key in shipmentPerDay) {
        shipmentGraph.push([new Date(key).getTime(),shipmentPerDay[key]])
        }
        //vm.shipmentPerDay = shipmentGraph;
        vm.shipmentPerFormat = [];
        vm.shipmentPerFormat = Utils.objectToObjectArray("format",shipmentPerFormat);
        vm.shipmentPerDay = Utils.graphGroupBy(shipmentGraph,vm.groupBy);
        vm.shipmentAway = objToArray(shipmentAway);
        vm.shipmentHome = objToArray(shipmentHome);
        vm.totalShipments = totalShipments;
        vm.procoCost = procoCost;
        console.log("Graph is ",shipmentGraph); 

    }
    function populateProducts(productSales,row){
        var count = row.num_orders;
        // Product breakdown
        if (!productSales[row.format]) {
            productSales[row.format]=angular.copy(obj);
        }
        productSales[row.format].count += count;
        productSales[row.format]['zone_'+returnZone(row.country)]+=count;
        
        if(row.size==1){
            productSales[row.format].q1.count += count;
            productSales[row.format].q1['zone_'+returnZone(row.country)] += count;
        } else if(row.size==2){
            productSales[row.format].q2.count += count;
            productSales[row.format].q2['zone_'+returnZone(row.country)] += count;

        }else if(row.size==3){
            productSales[row.format].q3.count += count;
            productSales[row.format].q3['zone_'+returnZone(row.country)] += count;

        } else if(row.size>3&&row.size<11){
            productSales[row.format].q4to10.count += count;
            productSales[row.format].q4to10['zone_'+returnZone(row.country)] += count;

        }else if(row.size>10){
            productSales[row.format].q11plus.count += count;
            productSales[row.format].q11plus['zone_'+returnZone(row.country)] += count;

        }
    }
    function returnZone(country){
        for(var i=0;i<vm.zones.length;i++){
            var countries = vm.zones[i].countries;
            var exist = false;
            countries.map(function(x){
                if(x.display_name==country){
                exist=true;
                }
            })
            if(exist){
                return ++i;
            }
        }
    }
    function objToArray(obj) {
        var arr = [];
        for (var key in obj) {
            var value = obj[key];
            var newObj = {};
            newObj.product = key;
            newObj.count = value.count;
            newObj.q1 = value.q1;
            newObj.q2 = value.q2;
            newObj.q3 = value.q3;
            newObj.q4to10 = value.q4to10;
            newObj.q11plus = value.q11plus;
            newObj.zone_1 = value.zone_1;
            newObj.zone_2 = value.zone_2;
            newObj.zone_3 = value.zone_3;
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
    vm.collapseNext= function ($event) {
        angular.element($event.currentTarget).next().collapse('toggle');
    }
    vm.tableStyle = function(index){
        return { 
            'background-color': index%2?'':'#f6f6f7',
            'border-top-style': 'solid',
            'border-top-color': '#e8e9ea',
            'border-top-width': '1px',
            'padding': '10px'
        }
    }
    }]);