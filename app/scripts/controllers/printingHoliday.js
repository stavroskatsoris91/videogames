app.controller('printingHolidayCtrl', ['Pricing','Utils', 'UINotification', '$mdDialog','$state','$stateParams', '$scope',
                    function(Pricing,Utils,UINotification,$mdDialog,$state,$stateParams,$scope) {
    var vm = this;
    vm.holidays = null;
    vm.countries = null;
    vm.today = new Date().getTime();
    vm.date = new Date();
    vm.newHoliday = {
      country: {code: "GB", display_name: "United Kingdom"},
      date: new Date().getTime(),
      enabled: true,
      mdDate: new Date ()
    };
    vm.newTime = {
      countries : [],
      min_days : 1,
      max_days : 2,
      print_earlier_days : 0,
      dispatch_type : "IMMEDIATE",
      enabled : true
    }

    vm.deleteRow = deleteRow;
    vm.switchStatus = switchStatus;
    vm.switchStatusTime = switchStatusTime;
    vm.saveRow = saveRow;
    vm.updateDate = updateDate;
    vm.addHoliday = addHoliday;
    vm.fixMinMax = fixMinMax;
    vm.selectCountry = selectCountry;
    vm.addCountry = addCountry;
    vm.answer = answer;
    vm.updateTime = updateTime;
    vm.deleteTime = deleteTime;
    vm.addTime = addTime;

    init();

    function init(){
      getHolidays();
      getTimes();
      getCountries();
    }
    function getCountries(){
      Pricing.getCountries().then(function(res){
        vm.countries= [];
        angular.forEach(res.delivery_countries,function(country,code){
          vm.countries.push({code:code,country:country});
        })
      })
    }
    function getHolidays(){
      Pricing.getHolidays().then(function(res){
        vm.holidays = res;
        vm.holidays.map(function(x){
          x.mdDate=new Date(x.date);
        })
      }).catch(function(err){
        console.log(err);
      })
    }
    function deleteRow(row) {
      var text = "";
      var confirm = $mdDialog.confirm()
          .title('Would you like to delete this date?')
          .textContent(text)
          .ariaLabel('Delete date')
          .targetEvent(row)
          .ok('YES')
          .cancel('NO');
      $mdDialog.show(confirm).then(function () {
        if (row.id) {
            Pricing.deleteHoliday(row).then(function (res) {
              for(var i=0;i<vm.holidays.length;i++){
                if(vm.holidays[i].id===res.id){
                    vm.holidays.splice(i, 1);
                    UINotification.success("date deleted");                      
                    break;
                  }
                }
            }).catch(function (err) {
                UINotification.error(err.data.message);
            });
        }
      }, function () {
          UINotification.success("You didn't delete this date");
      });
  }
  function switchStatus(row){
    row.enabled = !row.enabled;
    saveRow(row);
  }
  function switchStatusTime(time){
    time.enabled = !time.enabled;
    updateTime(time);
  }
  function saveRow(row){
    if(row.id){
      Pricing.updateHoliday(row).then(function(res){
        for(var i=0;i<vm.holidays.length;i++){
          if(vm.holidays[i].id===res.id){
            vm.holidays[i] = res;
            vm.holidays[i].mdDate = new Date(res.date);
            break;
          }
        }
        UINotification.success("date updated");
      }).catch(function(err){
        UINotification.error(err.data.message);
        
      })
    }
  }
  function updateDate(holiday){
    holiday.date = new Date(holiday.mdDate).getTime();
  }
  function addHoliday(){
    Pricing.addHoliday(vm.newHoliday).then(function(res){
      res.mdDate = new Date(res.date);
      vm.holidays.push(res);
      vm.new=false;
      UINotification.success("date updated");
    }).catch(function(err){
      UINotification.error(err.data.message);
    })
  }
  function getTimes(){
    Pricing.getDeliveryTime().then(function(res){
      vm.times = res;
    })
    .catch(function(err){
      UINotification.error(err.data.message);
    })
  }
  function fixMinMax(time){
    time.min_days = parseInt(time.min_days);
    time.max_days = parseInt(time.max_days);
    if(time.min_days>time.max_days){
      time.max_days = time.min_days;
    }

  }
  function addCountry(ev){
    if(!ev.selected){
      ev.selected = 'same';
      var exists = false;
      for(var i = 0; i<vm.ev.countries.length;i++){
        if(vm.ev.countries[i].code == ev.code){
          vm.ev.countries.splice(i,1);
          exists = true;
          break;
        }
      }
      if(!exists){
        vm.ev.countries.push({code:ev.code,display_name:ev.country});
      }
    }
    else if(ev.selected === 'same'){
      ev.selected = null;
      for(var i = 0; i<vm.ev.countries.length;i++){
        if(vm.ev.countries[i].code == ev.code){
          vm.ev.countries.splice(i,1);
          break;
        }
      }
    }
  }
  function selectCountry(ev) {
    vm.ev = angular.copy(ev);
    vm.countries.map(function(countries){
      vm.times.map(function(times){
        if(times.id===vm.ev.id){
          times.countries.map(function(y){
            if(y.code==countries.code){
              countries.selected = 'same';
            }
          })
        }else if(times.dispatch_type==vm.ev.dispatch_type){
          times.countries.map(function(y){
            if(y.code==countries.code){
              countries.selected = 'other';
            }
          })
        }
      })
      if(!vm.ev.id){
        vm.ev.countries.map(function(y){
          if(y.code==countries.code){
            countries.selected = 'same';
          }
        })
      }
    })
    $mdDialog.show({
      controller: function () {
          return vm;
      },
      controllerAs: 'vm',
      templateUrl: 'tabDialog.tmpl.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose: true,
      local: { ev: ev }
    })
      .then(function (answer) {
        if (answer) {
          ev.countries = vm.ev.countries;
          if(ev.id){
            updateTime(ev);
          }
        }
      }, function () {
          console.log("Yes");

      });
  }
  function answer(answer) {
    $mdDialog.hide(answer);
  }
  function updateTime(time){
    Pricing.updateDeliveryTime(time).then(function(res){
      vm.times.map(function(x){
        if(x.id==res.id){
          x=res;
        }
      })

    UINotification.success("time updated");
    }).catch(function(err){
      UINotification.error(err.data.message);
    })
  }
  function deleteTime(time){
    var text = "";
      var confirm = $mdDialog.confirm()
          .title('Would you like to delete this time?')
          .textContent(text)
          .ariaLabel('Delete time')
          .targetEvent(time)
          .ok('YES')
          .cancel('NO');
      $mdDialog.show(confirm).then(function () {
        if (time.id) {
            Pricing.deleteDeliveryTime(time).then(function (res) {
              for(var i=0;i<vm.times.length;i++){
                if(vm.times[i].id===res.id){
                    vm.times.splice(i, 1);
                    UINotification.success("time deleted");                      
                    break;
                  }
                }
            }).catch(function (err) {
                UINotification.error(err.data.message);
            });
        }
    }, function () {
        UINotification.success("You didn't delete this time");
    });
  }
  function addTime(){
    Pricing.addDeliveryTime(vm.newTime).then(function(res){
      vm.times.push(res);
      UINotification.success("time created");                      
    }).catch(function (err) {
      UINotification.error(err.data.message);
    });
  }
}]);