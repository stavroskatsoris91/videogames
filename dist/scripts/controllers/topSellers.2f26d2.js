app.controller('topSellersCtrl', ['Profile','Utils','UINotification',
                    function(Profile,Utils,UINotification) {
    var vm = this;
    vm.topSellers = [];
    vm.page = 0;
    vm.period = new Date();
    vm.today = new Date();
    vm.allSellersList = [];
    vm.requests =0;
    vm.responses =0;
    vm.start = false;
    vm.refresh = refresh;
    vm.load = load;
    vm.salesByProfile = salesByProfile;
    vm.allSellers = allSellers;
    vm.startCsv =startCsv;



    init();

    function init() {
      // set the paging and month selection
      load(vm.page);
    }

    function load(page) {
      vm.page = page;
      Profile.getTopSellers(vm.period,page).then(function(res){
        console.log("top sellers are",res);
        vm.topSellers = res;
      }).catch(function(err){
        UINotification.error("Something went wrong :(");
      });

    }

    function salesByProfile(profile) {
      var sales = profile.profile_report.monthly_sales;
      var year = vm.period.getUTCFullYear();
      var month = vm.period.getUTCMonth() + 1;

      for (var i=0; i<sales.length; i++ ){
        if (sales[i].month == month && sales[i].year == year) {
          return sales[i].count;
        }
      }
      return "N/a";
    }

    function refresh() {
      load(0);
    }
    function startCsv(){
      vm.start=true;
      vm.requests = 0;
      vm.responses = 0;
      allSellers();
    }
    function allSellers(){
      
      var startDate = new Date("2016");
      var year = startDate.getUTCFullYear();
      var month = startDate.getUTCMonth() + 1;
      var todayYear = vm.today.getUTCFullYear();
      var todayMonth = vm.today.getUTCMonth() +1;

      for(var i = year; i<=todayYear;i++)
      {
        month = i>year?1:month;
        for(var j = month; j<=(i==todayYear?todayMonth:12);j++)
        {
          var k= j<10?"0"+j:j;
          allSellersLoad(new Date(i+'-'+k),0);
        }
      }
    }
    function allSellersLoad(date,page){
      if(vm.start){
        vm.requests++;
        Profile.getTopSellers(date,page).then(function(res){      
            if(!res.is_last){
              allSellersLoad(date,++page);
            }
            vm.responses++;
            saveProfiles(res.profiles);
          }).catch(function(err){
            vm.requests = 0;
            vm.responses = 0;
            if(vm.start){
              UINotification.error("Something went wrong :(, Please try again");
            }
            vm.start =false;
          });
      }else{
        vm.requests = 0;
        vm.responses = 0;
      }

    }
    function saveProfiles(profiles){
      profiles.map(function(x){
        var isNew = true;
        for(var index = 0; index<vm.allSellersList.length;index++){
          if(x.id===vm.allSellersList[index].id){
            isNew =false;
            break;
          }
        }
        if(isNew){
          vm.allSellersList.push(x);
        }
      })
      if(vm.requests&&vm.responses===vm.requests){
        sortSellers();
      }
    }
    function sortSellers(){
      vm.totalSales = [];
      var lastMonth = vm.today.getUTCMonth()===0?new Date((vm.today.getUTCFullYear()-1)+'-'+12):new Date(vm.today.getUTCFullYear()+'-'+vm.today.getUTCMonth())
      vm.allSellersList.map(function(x){
        var csvInfo ={
          id: x.id,
          nickame : x.public_profile.nickname,
          firstname: x.contact.firstname,
          email : x.contact.email,
          profile_created: new Date(x.created_at_gmt).toISOString().slice(0,10),
          total_cards_sold:x.profile_report.total_cards_sold,
          //total_cards_sold2: 0,
          last_month_sales: 0,
          this_month_sales: 0,
          creator_tier: x.creator_tier,
        }
        x.profile_report.monthly_sales.map(function(sales){
          //csvInfo.total_cards_sold2 +=sales.count;//this is different
          if(sales.year==vm.today.getUTCFullYear()&&sales.month==(vm.today.getUTCMonth() + 1))
          {
              csvInfo.this_month_sales=sales.count;
          }
          if(sales.year==lastMonth.getUTCFullYear()&&sales.month==(lastMonth.getUTCMonth() + 1))
          {
              csvInfo.last_month_sales=sales.count;
          }
        });
        if(vm.totalSales.length){
          for(var index = 0; index<vm.totalSales.length;index++){
            
            if(vm.totalSales[index].total_cards_sold<csvInfo.total_cards_sold){
              vm.totalSales.splice(index, 0, csvInfo);
              break;
            }
            if(index===vm.totalSales.length-1){
              vm.totalSales.push(csvInfo);
              break;
            }
          }
        }else{
          vm.totalSales.push(csvInfo);
        }

      })
      console.log(vm.totalSales);
      vm.start = false;
      getcsv(vm.totalSales,'Top Sellers '+vm.today.toISOString().slice(0,10));
      vm.requests =0;
      vm.responses =0;
    }
    function getcsv(list,name){
      var json = list
      var fields = Object.keys(json[0])
      var replacer = function(key, value) { return value === null ? '' : value } 
      var csv = json.map(function(row){
      return fields.map(function(fieldName){
          return JSON.stringify(row[fieldName], replacer)
      }).join(',')
      })
      csv.unshift(fields.join(',')) // add header column
      csv=csv.join('\r\n')
      Utils.csvDownload(csv,name)
      vm.coupons = [];
      vm.downloading = false;
      vm.percentage = 0;
  }
}]);