app.controller('printingCenterCtrl', ['UINotification','Printer','Pricing', '$mdDialog','$state','$stateParams', '$scope',
                    function(UINotification,Printer,Pricing,$mdDialog,$state,$stateParams,$scope) {
    var vm = this;
    vm.shipmentPerDay = [];
    vm.itemOptionStock = [];
    vm.printers = [];
    vm.printerId = '430801';
    vm.date = new Date();
    vm.hour = 0;
    vm.minutes =0;
    vm.setDate = false;
    vm.setTime = false;
    vm.isGod = false;
    vm.newPrinter = {
      "printer" : "PROCO",
      "days" : 0,
      "country" : {
          "code" : ""
      },
      "max_hour_delivery" : 0,
      "enabled" : true
    };

    vm.updateInfo = updateInfo;
    vm.fixHour = fixHour;
    vm.fixMinutes = fixMinutes;
    vm.selectPrinter = selectPrinter;
    vm.deltePrinterDialog = deltePrinterDialog;
    vm.editPrinterDialog = editPrinterDialog;
    vm.deletePrinter = deletePrinter;
    vm.updatePrinter = updatePrinter;
    vm.closeDialog = closeDialog;
    init();
    function init(){
      Printer.get().then(function(res){
        vm.printer={}; 
        vm.printers = res;
       vm.printer = vm.printers[0];
       selectPrinter();
      }).catch(function(err){
        UINotification.error(err.data.message);
      })
      getCountries();
    }
    function selectPrinter(){
      vm.date = vm.printer.dispatch_date_printing?(new Date(vm.printer.dispatch_date_printing)):new Date();
      vm.hour = vm.printer.dispatch_hour_printing?vm.printer.dispatch_hour_printing:0;
      vm.minutes = vm.printer.dispatch_minute_printing?vm.printer.dispatch_minute_printing:0;
    }
    function getPrinterInfo(printerId){
      Printer.getPrinterInfo(printerId).then(function(res){
        console.log(res);
      }).catch(function(err){
        UINotification.error(err.data.message);
      })
    }
    function updateInfo(){
      var data = {};
      if(vm.setDate){
        data.dispatch_date = vm.date.getFullYear()+'-'+(vm.date.getMonth()+1)+'-'+vm.date.getDate();

      }
      if(vm.setTime){      
        data.printing_max_hour = vm.hour;
        data.printing_max_minute = vm.minutes;
      }
      Printer.updateInfo(vm.printer.id,data).then(function(res){
        vm.printer = res;
        vm.printers.map(function(x,index){
          if(x.id==res.id){
            vm.printers[index]= res;
          }
        })
        UINotification.success("Orders updated");
      }).catch(function(err){
        UINotification.error(err.data.message);
      })
    }
    function fixHour(){
      if(vm.hour>=24){
        vm.hour=vm.hour%24;
      }
      else if(vm.hour<0){
        vm.hour = 23;
      }
    }
    function fixMinutes(){
      if(vm.minutes>=60){
        vm.hour+= Math.floor(vm.minutes/60);
        vm.minutes=vm.minutes%60;
        fixHour();
      }else if(vm.minutes<0){
        vm.minutes = 59;
        vm.hour--;
        fixHour();
      }
    }
    function deltePrinterDialog(){

      $mdDialog.show({
          template:
              '<md-dialog aria-label="Delete Printer">' +
                  '<div layout-padding layout="column">' +
                      '<md-title class="h3">Delete {{vm.printer.printer}}?</md-title>' +
                      '<p class="text-center">' +
                          '<md-button ng-click="vm.deletePrinter()" class="btn btn-primary">Yes</md-button>  ' +
                          '<md-button ng-click="vm.closeDialog()" class="btn btn-default">No</md-button>' +
                      '</p>' +
                  '</div>'+
              '</md-dialog>',
          scope: $scope,
          preserveScope: true,
      })
    }
    function closeDialog() {
      $mdDialog.cancel();

    }
    function deletePrinter(){
      closeDialog();
      Printer.deletePrinter(printer).then(function(res){
        init();
        UINotification.success("Printer Deleted");
    }).catch(function(err){
      UINotification.error(err.data.message);
    })
    }
    function editPrinterDialog(printer){
      vm.selectedPrinter = angular.copy(printer);
        $mdDialog.show({
            template:
                '<md-dialog aria-label="Edit Printer">' +
                    '<div layout-padding layout="column">' +
                        '<div class="panel panel-card">'+
                        '<div class="panel-body">'+
                        '  <form name="edit">'+
                        '   <div>'+
                        '    <md-input-container>'+
                        '      <input mdInput placeholder="Name" disabled="!vm.isGod" ng-model="vm.selectedPrinter.printer">'+
                        '    </md-input-container>'+
                        '    <md-input-container>'+
                        '      <md-checkbox disabled="!vm.isGod" ng-model="vm.selectedPrinter.enabled">Enabled</md-checkbox>'+
                        '    </md-input-container>'+
                        '     </div>'+
                        '     <div>'+
                        '    <md-input-container>'+
                        '      <input mdInput type="number" disabled="!vm.isGod" name="days" placeholder="Days" ng-model="vm.selectedPrinter.days" min="0">'+
                        '      <div ng-messages="edit.days.$error" role="alert">'+
                        '        <div ng-message="min">'+
                        '          Day can not be less than 0'+
                        '        </div>'+
                        '      </div>'+
                        '    </md-input-container>'+
                        '    <md-input-container>'+
                        '      <input mdInput type="number" name="maxHour" placeholder="Max Hours" ng-model="vm.selectedPrinter.max_hour_delivery" min="0" max="23">'+
                        '      <div ng-messages="edit.stock.$error" role="alert">'+
                        '        <div ng-message="min||max">'+
                        '          Hour can not be less than 0 or more than 23'+
                        '        </div>'+
                        '      </div>'+
                        '    </md-input-container>'+
                        '     </div>'+
                        '    <md-input-container class="pull-left">'+
                        '      <label>Country</label>                        '+
                        '      <md-select ng-model="vm.selectedPrinter.country.code" disabled="!vm.isGod" name="country" required>'+
                        '        <md-option ng-repeat="country in vm.countries | orderBy: \'country\'" ng-value="country.code">{{country.country}}</md-option>'+
                        '      </md-select>'+
                        '      <div ng-messages="edit.country.$error" role="alert">'+
                        '        <div ng-message="required">Required field</div>'+
                        '      </div>'+
                        '    </md-input-container>'+
                        '    <md-input-container>'+
                        '      <input mdInput placeholder="Time Zone" disabled="!vm.isGod" ng-model="vm.selectedPrinter.time_zone_id">'+
                        '    </md-input-container>'+
                        '  </form>'+
                        '</div>'+
                        '</div>'+
                        '<p class="text-center">' +
                            '<md-button ng-click="vm.updatePrinter(vm.selectedPrinter)" class="btn btn-primary">Yes</md-button>  ' +
                            '<md-button ng-click="vm.closeDialog()" class="btn btn-default">No</md-button>' +
                        '</p>' +
                    '</div>'+
                '</md-dialog>',
            scope: $scope,
            preserveScope: true,
        })
    }
    function updatePrinter(printer){
      closeDialog();
      if(printer.id){
        Printer.updatePrinter(printer).then(function(res){
          init();
          UINotification.success("Printer Updated");
        }).catch(function(err){
        UINotification.error(err.data.message);
        });
      }else{
        Printer.setPrinter(printer).then(function(res){
          init();
          UINotification.success("New Printer Created");
        }).catch(function(err){
          UINotification.error(err.data.message);
        });
      }
    }
    function getCountries(){
      Pricing.getCountries().then(function(res){
        vm.countries = [];
        angular.forEach(res.delivery_countries, function(val, key) {
          vm.countries.push({country:val,code:key});
      });
      })
    }
}]);