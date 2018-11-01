app.controller('topSellingCtrl', ['Cards','Stats',
                    function(Cards,Stats) {
    var vm = this;
    vm.topSelling = [];
    vm.toDate =new Date();
    vm.fromDate =new Date();
    vm.dateType = '7_days';
    vm.category = 'all';
    vm.groupBy = 'occasion';

    vm.salesByCard = salesByCard;
    vm.load = load;
    vm.collapseNext = collapseNext;

    load();
    function load() {
       Stats.getOccasionCardSales(vm.fromDate,vm.toDate,vm.category!='all'?vm.category:null).then(function(res){
         vm.topSelling = res;
         if(vm.category==='all'){
           salesByCard();
         }
       }).catch(function(err){
         console.log(err);
       });
    }
     function salesByCard() {
       var topSingle= [];
       vm.topSelling.map(function(x){
        var same =false;
        topSingle.map(function(y){
          if(y.card.id===x.card.id){
            y.group.push({
              quantity : x.quantity,
              category_name : x.category_name
            })
            y.quantity = Number(y.quantity)+Number(x.quantity);
            same = true;
          }
        })
        if(!same){
          x.group = [{
            quantity : x.quantity,
            category_name : x.category_name
          }]
          topSingle.push(x);
        }
      })
      vm.topSelling = topSingle;
    }
    function collapseNext($event) {
     let element=angular.element($event.currentTarget);
     element.next().collapse('toggle');
     if(element.next()["0"].attributes[1].value==="false"){
      element.children()["0"].className = "icon mdi-navigation-expand-more";
     }else{
      element.children()["0"].className = "icon mdi-navigation-expand-less";
      
     }
  }
}]);