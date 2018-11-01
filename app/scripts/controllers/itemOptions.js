'use strict';
app.controller('itemOptionsCtrl', [ 'Discount','CardVariation','Cards','Order','UINotification','$mdDialog','$state','$stateParams',
                    function(Discount,CardVariation,Cards,Order,UINotification,$mdDialog,$state,$stateParams) {
  var vm = this;
  var optionId = $stateParams.optionId;
  vm.createMode = false;
  vm.editMode = false;

  console.log("state is ",$state);
  if ($state.current.data.create) {
    vm.createMode = true;
  }

  vm.printerFormat = ["A5","NOTEBOOK","SOCKS","CHOCOLATE"];
  vm.target = ["ORDER_ITEM","ORDER"];
  vm.customerType = ["NEW","RETURNING","NONE"];
  vm.categoryList = [];
  vm.campaign = [];
  vm.text = {};

  // functions
  vm.enable = enable;
  vm.disable = disable;  
  vm.edit = edit;
  vm.save = save;
  vm.addItem = addItem;
  vm.removeItem = removeItem;
  vm.isEmpty = isEmpty;

  init();

  function init() {
    
    // Create mode
    if (vm.createMode) {
      vm.option = {
        campaign_ids: [],
        required : true};

    } else {
      if (optionId) {
        Order.getItemOption(optionId).then(function(res) {
          console.log("Res ",res);
          vm.option = res;
          if(vm.option.campaign_ids===null){
            vm.option.campaign_ids = [];
          }
        }).catch(function(err){
          console.log("Error",err);
        });
      } else {
        Order.getItemOptions().then(function(res) {
          console.log("Res ",res);
          vm.options = res;
        }).catch(function(err){
          console.log("Error",err);
        });
      }
    }
    getCategory();
    getVariation();
  }

  function enable() {
    vm.option.enabled = true;
    Order.updateItemOption(vm.option).then(function(res){
      UINotification.success("Option Enabled");
    }).catch(function(err){
      UINotification.error("Couldn't enable option");
    });
  }

  function disable(option) {
    vm.option.enabled = false;
    Order.updateItemOption(vm.option).then(function(res){
      UINotification.success("Option Disabled");
    }).catch(function(err){
      UINotification.error("Couldn't disable option");
    });
  }

  function edit() {
    vm.editMode = true;
  }
  function save() {
    if (vm.createMode) {

      Order.createItemOption(vm.option).then(function(res){
      UINotification.success("Option Created");      
        $state.go('cards.option',{optionId: res.id});
      }).catch(function(err){
        UINotification.error(err.data.message);
      })
    } else {
            Order.updateItemOption(vm.option).then(function(res){
        console.log("res",res);

      }).catch(function(err){
        UINotification.error(err.data.message);
      })
      // save
      // if success
      vm.editMode = false;
    }
  }
  function getCategory() {
      Cards.getCategories().then(function (res) {
          vm.categoryList = res;
      }).catch(function(err){
        UINotification.error(err.data.message);
      })
  }
  function getVariation() {
    CardVariation.getSettings().then(function(res){
      vm.printerFormat = res.printer_format;      
    }).catch(function(err){
      UINotification.error(err.data.message);
      
    })
  }
  function addItem(item,place){
      if(item){
        if(!place.includes(item)){
            place.push(item);
        }
        vm.text={};
      }
  }
  function removeItem(item,place){
      place.splice(place.indexOf(item), 1);
  }
  function isEmpty(){
    if(     
      vm.option.customisation&&
      vm.option.name&&
      (vm.option.position||vm.option.position===0)&&
      vm.option.printer_format&&
      vm.option.printer_name&&
      (vm.option.stock||vm.option.stock===0)&&
      vm.option.target)
      {
        return false;
      }else{
        return true;
      }
  }
}
]);