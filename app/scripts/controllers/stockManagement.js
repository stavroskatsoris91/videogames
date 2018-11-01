app.controller('stockManagementCtrl', ['Stock','Stats','CardVariation','Utils','UINotification','$mdDialog','$state','$stateParams', '$scope','$q',
                    function(Stock,Stats,CardVariation,Utils,UINotification,$mdDialog,$state,$stateParams,$scope,$q) {
    var vm = this;
    vm.itemOptionStock = [];
    vm.options =['NONE','HOME_FILL','DIRECT_SEND'];
    vm.packaging_formats=["ENVELOPE", "ACCESSORY", "BOX", "SOCK_BANDS"];
    vm.stateId = $stateParams.id;
    
    vm.newPackage = {
      "name" : "",
      "packaging_format" : "",
      "customisation" : "",
      "printer_name" : "",
      "stock" : 0,
      "enabled" : true,
      "group_package": true,
      "criterias" : [],
      "supplier_contacts" : []
    };

    vm.newCriteria = {
      "min_quantity" : 0,
      "max_quantity" : 0,
      "format_target" : [],
      "recipient_type" : "NONE"
    };
    vm.newSupplier ={
      "company_name": '',
      "company_contacts": [],
      "lead_time": '',
      "minimum_order_quantity": 0
    };
    vm.newContact = {
      "first_name":'',
      "last_name":'',
      "email":[''],
      "phone_number":[''],
      "edit": true
    };

    vm.changeStatus = changeStatus;
    vm.editItem = editItem;
    vm.deleteDialog = deleteDialog;
    vm.deleteCriteriaDialog = deleteCriteriaDialog;
    vm.deleteSupplierDialog = deleteSupplierDialog;
    vm.deleteSupplier = deleteSupplier;
    vm.deleteCriteria = deleteCriteria;
    vm.deleteItem = deleteItem;
    vm.addItem = addItem;
    vm.saveItem = saveItem;
    vm.closeDialog = closeDialog;
    vm.saveCriteria = saveCriteria;
    vm.addCriteria = addCriteria;
    vm.saveSupplier = saveSupplier;
    vm.addSupplier = addSupplier;
    vm.updateCriteriaStatus = updateCriteriaStatus;
    vm.reload = reload;    

    init();

    function init() {
      if(vm.stateId){
        if(vm.stateId=='new'){
          vm.item = vm.newPackage;
        }
        else{
          Stock.getPackagingById(vm.stateId).then(function(res){
            vm.item = res;
          })
        }
        CardVariation.getSettings().then(function(res){
          vm.formats = res.printer_format;
        })
      }
      else{
        Stats.getItemOptionStock().then(function(res) {
          vm.itemOptionStock = res;
        });
        Stats.getDispatchLaterOrders().then(function(res){
          stockReportLater(res);
        });
      }
    }
    function saveCriteria(criteria){
      Stock.updateCriteria(vm.item.id,criteria).then(function(res){
        vm.item = res;
        UINotification.success("Criteria updated");  
      }).catch(function(err){
        UINotification.error(err.data.message);        
      })

    }
    function changeStatus(item){
      item.enabled = !item.enabled;
      Stock.updatePackaging(item).then(function(res){
        item = res;
        UINotification.success('package is updated');
      }).catch(function(err){
        UINotification.error(err.data.message);        
      })
    }
    function editItem(item){
      $state.go('printing.stockManagement',{id:item.id})
    }
    function addItem(item){
      Stock.setPackaging(item).then(function(res){
        UINotification.success('package is updated');
        $state.go('printing.stockManagement',{id:res.id});
      }).catch(function(err){
        UINotification.error(err.data.message);        
      })
    }
    function saveItem(item){
      Stock.updatePackaging(item).then(function(res){
        vm.item = res;
        UINotification.success('package is updated');
      }).catch(function(err){
        UINotification.error(err.data.message);        
      })
    }
    function deleteDialog(item){
        vm.selectedItem = item;
        $mdDialog.show({
            template:
                '<md-dialog aria-label="Delete Packaging">' +
                    '<div layout-padding layout="column">' +
                        '<md-title class="h3">Delete {{vm.selectedItem.name}}?</md-title>' +
                        '<p class="text-center">' +
                            '<md-button ng-click="vm.deleteItem(vm.selectedItem)" class="btn btn-primary">Yes</md-button>  ' +
                            '<md-button ng-click="vm.closeDialog()" class="btn btn-default">No</md-button>' +
                        '</p>' +
                    '</div>'+
                '</md-dialog>',
            scope: $scope,
            preserveScope: true,
        })
    }
    function deleteCriteriaDialog(criteria){
      vm.selectedCriteria = criteria;
      $mdDialog.show({
        template:
            '<md-dialog aria-label="Delete Criteria">' +
                '<div layout-padding layout="column">' +
                    '<md-title class="h3">Delete {{vm.selectedCriteria.printer_format_hash}}?</md-title>' +
                    '<p class="text-center">' +
                        '<md-button ng-click="vm.deleteCriteria(vm.selectedCriteria)" class="btn btn-primary">Yes</md-button>  ' +
                        '<md-button ng-click="vm.closeDialog()" class="btn btn-default">No</md-button>' +
                    '</p>' +
                '</div>'+
            '</md-dialog>',
        scope: $scope,
        preserveScope: true,
      })
    }
    function deleteSupplierDialog(supplier){
      vm.selectedSupplier = supplier;
      $mdDialog.show({
        template:
            '<md-dialog aria-label="Delete Supplier">' +
                '<div layout-padding layout="column">' +
                    '<md-title class="h3">Delete {{vm.selectedSupplier.company_name}}?</md-title>' +
                    '<p class="text-center">' +
                        '<md-button ng-click="vm.deleteSupplier(vm.selectedSupplier)" class="btn btn-primary">Yes</md-button>  ' +
                        '<md-button ng-click="vm.closeDialog()" class="btn btn-default">No</md-button>' +
                    '</p>' +
                '</div>'+
            '</md-dialog>',
        scope: $scope,
        preserveScope: true,
      })
    }
    function deleteCriteria(criteria){
      $mdDialog.cancel();
      Stock.deleteCriteria(vm.item.id,criteria).then(function(res){
        vm.item = res;
        UINotification.success("Criteria deleted");
      }).catch(function(err){
        UINotification.error(err.data.message);        
      })
    }
    function deleteSupplier(supplier){
      $mdDialog.cancel();
      Stock.deleteSupplier(vm.item.id,supplier).then(function(res){
        vm.item = res;
        UINotification.success("Supplier deleted");
      }).catch(function(err){
        UINotification.error(err.data.message);        
      })
    }
    function deleteItem(item){
      $mdDialog.cancel();
      Stock.deletePackaging(item.id).then(function(res){
        Stock.getAllPackaging(true).then(function(res){
        UINotification.success("Package deleted");
        vm.items = res;
        });
      }).catch(function(err){
        UINotification.error(err.data.message);        
      })
    }
    function closeDialog() {
      $mdDialog.cancel();
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
    function addCriteria(criteria){
      Stock.setCriteria(vm.item.id,criteria).then(function(res){
        vm.item = res;
        UINotification.success("Criteria Added");
      }).catch(function(err){
        UINotification.error(err.data.message);        
      })    
    }
    function saveSupplier(supplier){
      Stock.updateSupplier(vm.item.id,supplier).then(function(res){
        vm.item = res;
        UINotification.success("Supplier updated");
      }).catch(function(err){
        UINotification.error(err.data.message);
      })  
      
    }
    function addSupplier(supplier){
      Stock.setSupplier(vm.item.id,supplier).then(function(res){
        vm.item = res;
        UINotification.success("Supplier Added");
      }).catch(function(err){
        UINotification.error(err.data.message);
      })
      
    }
  function updateCriteriaStatus(criteria,status){
    criteria.status = status;
    Stock.updateCriteriaStatus(vm.item.id,criteria).then(function(res){
      vm.item = res;
      UINotification.success("Criteria status Updated");
    }).catch(function(err){
      UINotification.error(err.data.message);
    })
  }
  function reload() {
    let stockPromise = $q.defer();
    let packagingPromise = $q.defer();
    getStockConsumed(stockPromise);
    getAllPackaging(packagingPromise);
    let allPromises = [stockPromise.promise,packagingPromise.promise];    
    $q.all(allPromises).then(function(res){
      res[0].map(function(x){
        res[1].map(function(y){
          if(x.item_id==y.id){
            y.quantity = y.quantity?y.quantity+x.quantity:x.quantity;
          }
        })
      })
      vm.items = res[1];
    })
  }
  function getStockConsumed(promise){
    Stats.getStockConsumed(vm.fromDate,vm.toDate).then(function(res){
      console.log("Consumed res is ", res);
      promise.resolve(res);
    }).catch(function(err){
      promise.reject("Error");        
    })
  }
  function getAllPackaging(promise){
    Stock.getAllPackaging().then(function(res){
      vm.items = res;
      promise.resolve(res);
    }).catch(function(err){
      promise.reject("Error");
        
    });
  }
}]);