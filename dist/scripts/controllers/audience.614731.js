app.controller('audienceCtrl', ['Stats', 'Utils', '$q', '$mdDialog', '$state', '$stateParams', '$scope',
    function (Stats, Utils, $q, $mdDialog, $state, $stateParams, $scope) {
        var vm = this;

        vm.reload = reload;

        vm.dataReady = false;
        vm.refresh = false;


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
            let orderPromise = $q.defer();
            let transactionPromise = $q.defer();
            let allPromises =[orderPromise.promise, transactionPromise.promise];
            Stats.getOrderSales(vm.fromDate,vm.toDate).then(function(res) {
                formatOrderData(res,orderPromise);
            }).catch(function(err) {
                //Something bad happened
                orderPromise.reject("Error");
            })
            Stats.getTransactionSales(vm.fromDate, vm.toDate).then(function (res) {
                formatTransactionData(res,transactionPromise);
            }).catch(function (err) {
                //Something bad happened
                transactionPromise.reject("Error");
            })
            $q.all(allPromises).then(function(res){
                vm.avgValueMale = res[1]['male']>0?res[0]['male']/res[1]['male']:0;
                vm.avgValueFemale = res[1]['female']>0?res[0]['female']/res[1]['female']:0;
            })
        }

        function formatTransactionData(res,promise) {
            var female = 0;
            var male = 0;
            var cardsMale = 0;
            var cardsFemale = 0;
            var unknown = 0;
            var total = 0;
            var malePerDay = {};
            var femalePerDay = {};
            console.log("Crunching");
            for (var i = 0; i < res.length; i++) {
                var day = Utils.toJSDateString(res[i].year,res[i].month,res[i].day); 
                if(!malePerDay[day]){
                    malePerDay[day] = 0;
                }
                if(!femalePerDay[day]){
                    femalePerDay[day] = 0;
                }       
                if (vm.excludeAmazon && res[i].campaign_name == "Amazon100") {
                    continue;
                }
                if (res[i].gender == "male") {
                    male += res[i].number_transaction;
                    malePerDay[day] += res[i].number_transaction;
                    cardsMale += res[i].number_transaction*res[i].card_quantity;

                } else if (res[i].gender == "female") {
                    female += res[i].number_transaction;
                    femalePerDay[day] += res[i].number_transaction;
                    cardsFemale += res[i].number_transaction*res[i].card_quantity;
                    
                } else {
                    unknown += res[i].number_transaction;
                }
                total += res[i].number_transaction;
                
            }
            var maleArray = [];
            for (var date in malePerDay) {
                var index = maleArray.length;
                for(i=0;i<maleArray.length;i++){
                    if(maleArray[i][0]>new Date(date).getTime()){
                        index = i;
                        i = maleArray.length+1;
                    }
                }
                maleArray.splice(index,0,[new Date(date).getTime(),malePerDay[date]]);
            }
            var femaleArray = [];
            for (var date in femalePerDay) {
                var index = femaleArray.length;
                for(i=0;i<femaleArray.length;i++){
                    if(femaleArray[i][0]>new Date(date).getTime()){
                        index = i;
                        i = femaleArray.length+1;
                    }
                }
                femaleArray.splice(index,0,[new Date(date).getTime(),femalePerDay[date]]);
            }
            vm.malePerDay = maleArray;
            vm.femalePerDay = femaleArray;
            vm.avgCardsMale = male>0?cardsMale/male:0;
            vm.transactionsMale = male;
            vm.transactionsFemale = female;
            vm.avgCardsFemale = female>0?cardsFemale/female:0;
            promise.resolve({male:male,female:female});
            
            console.log("per day ", vm.malePerDay,vm.femalePerDay);
            console.log("Unknwon gender ", unknown);

            if (male + female > 0) {
                vm.user_gender = [];
                vm.user_gender[0] = {
                    label: "female",
                    data: (female + male)>0?(female / (female + male) * 100):0
                }
                vm.user_gender[1] = {
                    label: "male",
                    data: (female + male)>0?(male / (female + male) * 100):0
                }
            }         
            console.log("User genders ", vm.user_gender); 
        }
       
        function formatOrderData(res,promise){
            var female = 0;
            var male = 0;
            var unknown = 0;
            var valueMale = 0;
            var valueFemale = 0;
            console.log("Crunching");
            for (var i = 0; i < res.length; i++) {
                if (res[i].gender == "male") {
                    valueMale += res[i].amount;
                    male += res[i].order_count;

                } else if (res[i].gender == "female") {
                    valueFemale += res[i].amount;
                    female += res[i].order_count;
                    
                } else {
                    unknown += res[i].number_transaction;
                }
            }
            vm.valueMale = valueMale;
            vm.male = male;
            vm.female = female;
            vm.valueFemale = valueFemale;
            promise.resolve({male:valueMale,female:valueFemale});
            
      ;  }
        function objToArray(obj) {
            var arr = [];
            for (var key in obj) {
                var value = obj[key];
                var newObj = {};
                newObj.size = key;
                newObj.count = value;
                arr.push(newObj);
            }

            arr.sort(function (a, b) {
                if (a.size < b.size) {
                    return -1;
                } else {
                    return 1;
                }
            });

            return arr;
        }

        function sizeToRange(size) {
            if (size == 1) {
                return "1";
            } else if (size == 2) {
                return "2";
            } else if (size == 3) {
                return "3";
            } else if (size == 4) {
                return "4";
            } else if (size < 8) {
                return "5-7";
            } else if (size == 8) {
                return "8";
            } else {
                return "9+";
            }
        }
    }]);