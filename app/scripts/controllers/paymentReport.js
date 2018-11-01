app.controller('paymentReportCtrl', ['Discount', 'Profile', 'Payment', 'Cards', 'UINotification','Utils','$timeout','$mdDialog', '$state', '$stateParams', '$scope',
    function (Discount, Profile, Payment, Cards, UINotification, Utils, $timeout, $mdDialog, $state, $stateParams, $scope) {
        var vm = this;

        vm.months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
        vm.years = [];
        vm.today = new Date();
        vm.today.setDate(0);
        vm.year = vm.today.getFullYear();
        vm.month = vm.today.getMonth();
        
        vm.toDate = toDate;
        vm.csvDownload = csvDownload;
        
        for(var i = 2015;i<=vm.year;i++){
            vm.years.push(i);
        }
        
        vm.reload = reload;

        function reload(date){
            if(!date){
                date = new Date(vm.year+'-'+((vm.month+1)<10?'0'+(vm.month+1):(vm.month+1))+'-20');
                vm.loading =true;
            }
            if(vm.loading){
                Payment.paymentReport(date).then(function(res){
                    if(res.data){
                        vm.loading = false;
                        vm.csv = res.data;
                        vm.search = {
                            month : vm.month,
                            year : vm.year
                        }
                        vm.report = csvJSON(res.data);
                        UINotification.success("CSV Download complete");
                        
                    }else{
                        vm.loading = false;                        
                        UINotification.error("No result found...");
                    }
                }).catch(function(err){
                    vm.loading = false;
                    UINotification.error(err.data.message);
                })
            }
        }
        function csvDownload(){
            Utils.csvDownload(vm.csv,'Payment Repot '+vm.months[vm.search.month]+' '+vm.search.year);
        }
        function toDate(date){
            return new Date(date);
        }
        function csvJSON(csv){

            var lines=csv.split("\n");
          
            var result = [];
          
            var headers=lines[0].split(",");
          
            for(var i=1;i<lines.length;i++){
          
                var obj = {};
                var currentline=lines[i].split(",");
          
                for(var j=0;j<headers.length;j++){
                    obj[headers[j]] = currentline[j];
                }
          
                result.push(obj);
          
            }
            
            //return result; //JavaScript object
            return result; //JSON
          }
    }]);    