app.controller('paymentsCtrl', ['Discount', 'Profile', 'Payment', 'Cards', 'UINotification','Utils','$timeout','$mdDialog', '$state', '$stateParams', '$scope',
    function (Discount, Profile, Payment, Cards, UINotification, Utils, $timeout, $mdDialog, $state, $stateParams, $scope) {
        var vm = this;

        vm.amount = 5;
        vm.ready = true;
        vm.loading = false;

        vm.unpaidCreators = unpaidCreators;
        vm.unpaidCreatorsReport = unpaidCreatorsReport;
        vm.payCreator = payCreator;
        vm.amountResult={};
        vm.search = "";
        vm.creatorList = [];
        vm.openDialog = openDialog;
        vm.goToProfile = goToProfile;
        vm.record = record;
        vm.pay = pay;
        vm.closeDialog = closeDialog;
        vm.massivePayment = massivePayment;
        vm.recordPayment = recordPayment;
        vm.csvDownload = csvDownload;


        // unpaidCreators();
         unpaidCreatorsReport();
        // payCreator();
         getPayment();
        // triggerUpdatePayment();
        // triggerCancelPayment();
        // creatorsPayments();
        // totalPayments();
        // vatCreators();
        // generateVat();
        // paymentReport();
        function unpaidCreators(){
            Payment.unpaidCreators(page,dir,key).then(function(res){

            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function unpaidCreatorsReport(clearCache){
            if(vm.amount>0&&vm.ready===true){
                var amount  = vm.amount;
                vm.ready = false;
                vm.creatorList = [];
                Payment.unpaidCreatorsReport(amount,clearCache).then(function(res){
                    vm.amountResult = res;
                    vm.ready = true;
                    if(vm.amount != amount){
                        unpaidCreatorsReport();
                    }                  
                }).catch(function(err){
                    vm.ready = true;
                    UINotification.error(err.data.message);
                })
            }
        }
        function payCreator(id){
            closeDialog();
            
            Payment.payCreator(id,vm.amount).then(function(res){
                UINotification.success("Payment Completed");
                unpaidCreatorsReport(true);
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function getPayment(){
            Payment.getPayment('all').then(function(res){

            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function triggerUpdatePayment(){
            Payment.triggerUpdatePayment().then(function(res){

            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function triggerCancelPayment(){
            Payment.triggerCancelPayment().then(function(res){

            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function CreatorsPayments(){
            Payment.creatorsPayments().then(function(res){

            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function TotalPayments(){
            Payment.totalPayments().then(function(res){

            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function vatCreators(){
            Payment.vatCreators().then(function(res){

            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function generateVat(){
            Payment.generateVat().then(function(res){

            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function massivePayment(){
            var confirm = $mdDialog.confirm()
            .title('Mass Payment')
            .textContent("Are you sure you want to pay all creators with more than £"+vm.amount+" of royalties?")
            .ariaLabel('Mass Payment')
            .ok('YES')
            .cancel('NO');
          $mdDialog.show(confirm).then(function() {
            TriggerMassPayment();
          }, function() {
            UINotification.success("Mass payment Cancelled");
          });
            
        }
        function paymentReport(){
            Payment.paymentReport().then(function(res){

            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function openDialog(){

            $mdDialog.show({
                template:
                '<md-dialog>'+
                '<md-button class="md-raised md-primary" ng-click="vm.goToProfile()">View Profile</md-button>'+
                '<md-button class="md-raised md-primary" ng-click="vm.record()">Record Payment</md-button>'+
                '<md-button class="md-raised md-primary" ng-click="vm.pay()">Process Payment</md-button>'+
                '</md-dialog>',
                scope: $scope,
                preserveScope: true,
                })
        }
        function goToProfile(id){
            $state.go('users.profile', { profileId: id })
        }
        function record(profile){
            vm.profileAmmount = profile.profile_report.unpaid_amount;
            vm.profileQuantity = profile.profile_report.unpaid_cards_quantity;
            vm.profileDate = new Date();
            vm.profile = profile;
            $mdDialog.show({
                template:
                '   <div class="card-heading">'+
                '       <h2>Payment Report</h2>'+
                '   </div>'+
                '   <div class="card-body">'+
                '       <div>'+
                '           <md-input-container>'+
                '               <input mdInput placeholder="Amount" ng-model="vm.profileAmmount" type="number" min="0" ng-change="vm.profileQuantity=vm.profileAmmount*2">'+
                '           </md-input-container>'+
                '       </div>'+
                '       <div>'+
                '           <md-input-container>'+
                '               <input mdInput placeholder="Cards" ng-model="vm.profileQuantity" type="number" min="0" ng-change="vm.profileAmmount=vm.profileQuantity/2">'+
                '           </md-input-container>'+
                '       </div>'+
                '       <div>'+
                '               <md-datepicker md-hide-icons="calendar" ng-model="vm.profileDate"></md-datepicker>'+
                '       </div>'+
                '   </div>'+
                '   <div class="card-body text-right">'+
                '       <button ng-click="vm.recordPayment(vm.profile.id)" class="btn btn-primary">Record Payment</button>  '+
                '       <button ng-click="vm.closeDialog()" class="btn btn-primary">Cancel</button>  '+
                '   </div>',
                scope: $scope,
                preserveScope: true,
                clickOutsideToClose: true,          
                })
        }
        function pay(profile){
            vm.profile = profile;
            $mdDialog.show({
                template:
                '   <div class="card-heading">'+
                '       <h2>Payment Report</h2>'+
                '   </div>'+
                '   <div class="list-group no-radius no-border">'+
                '       <div class="list-group-item">'+
                '           <span class="pull-right">{{vm.profile.paypal_account.email}}</span> PayPal'+
                '       </div>'+
                '       <div class="list-group-item">'+
                '           <span class="pull-right">£{{vm.profile.profile_report.unpaid_amount}}</span> Total Amount to pay'+
                '       </div>'+
                '       <div class="list-group-item">'+
                '           <span class="pull-right">{{vm.profile.profile_report.unpaid_cards_quantity}}</span> Total Amount to pay'+ 
                '       </div>'+
                '   </div>'+
                '   <div class="card-body text-right">'+
                '       <button ng-click="vm.payCreator(vm.profile.id)" class="btn btn-primary">Pay Creator</button>  '+
                '       <button ng-click="vm.closeDialog()" class="btn btn-primary">Cancel</button>  '+
                '   </div>',
                scope: $scope,
                preserveScope: true,
                clickOutsideToClose: true,          
                })
        }
        function closeDialog(){
            $mdDialog.cancel();            
        }
        function TriggerMassPayment(){
            Payment.massivePayment(vm.amount).then(function(res){
                console.log("res.status", res.status);
                if(res.status===202){
                    UINotification.success("Mass payment started");
                } else if (res.status === 200) {
                    UINotification.error("Mass payment completed from previous run");
                    vm.data= res.data;
                }
            }).catch(function(err){
                vm.loading  = false;
                UINotification.error(err.data.message);
            })
        }
        function recordPayment(id){
            $mdDialog.cancel();                        
            Payment.recordPayment(id, vm.profileAmmount, vm.profileQuantity, vm.profileDate).then(function(res){
                UINotification.success("Payment Record Completed");                
            }).catch(function(err){
                UINotification.error(err.data.message);
            })

        }
        function csvDownload(data,name){
            var report = [];
                for(var i = 0;i<data.length;i++){
                   report.push({
                           first_name :data[i].contact.firstname,
                           sur_name: data[i].contact.surname,  
                           email: data[i].contact.email,
                           amount: '£'+data[i].profile_report.unpaid_amount.toFixed(2)
                   })
                }
            var json = report;
            var fields = Object.keys(json[0])
            var replacer = function(key, value) { return value === null ? '' : value } 
            var csv = json.map(function(row){
            return fields.map(function(fieldName){
                return JSON.stringify(row[fieldName], replacer)
            }).join(',')
            })
            csv.unshift(fields.join(',')) // add header column
            csv=csv.join('\r\n')
            Utils.csvDownload(csv,name);      
        }

    }]);    