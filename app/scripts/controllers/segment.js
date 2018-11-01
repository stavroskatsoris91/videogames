app.controller('segmentCtrl', ['Discount', 'Profile', 'Cards', 'UINotification','Utils','$timeout','$mdDialog', '$state', '$filter', '$stateParams', '$scope',
    function (Discount, Profile, Cards, UINotification, Utils, $timeout, $mdDialog, $state, $filter, $stateParams, $scope) {
        var vm = this;
        vm.getCategory = getCategory;
        vm.getCampaign = getCampaign;
        vm.addItem = addItem;
        vm.addItems = addItems;
        vm.filter = filter;
        vm.removeItem = removeItem;
        vm.csvDownload = csvDownload;
        vm.cancel = cance;

        vm.today = new Date();
        vm.day = 24 * 60 * 60 * 1000;
        vm.categoryList = [];
        vm.discountType = null;
        vm.loading = false;
        vm.campaign = [];
        vm.text={};

        vm.parameters={
            start :  new Date(new Date().setDate(-30)),
            end : vm.today,
            category : [],
            tag : [],
            campaign : [],
            coupon : [],
           
        }
        getCategory();
        function getCategory() {
            Cards.getCategories().then(function (res) {
                vm.categoryList = res;
            })
        }
        function getCampaign() {
            vm.campaign = [];
                    Discount.getCampaign(vm.campaignType).then(function (res) {
                        vm.campaign = res;
                }).catch(function (err) {
                    UINotification.error(err.data.message);
                });
        }
        function addItem(item,place){
            if(item){
                if(!place.includes(item)){
                    place.push(item);
                }
                    vm.text={};
            }
        }
        function addItems(item,place){
            item.map(function(x){
                addItem(x,place);
            })
        }
        function filter(data,text){
            return $filter('filter')(data, text);
        }
        function removeItem(item,place){
            place.splice(place.indexOf(item), 1);
        }
        function csvDownload(){
            var csv ={};
            csv.start_date=vm.parameters.start.toISOString().slice(0,10);
            csv.end_date=vm.parameters.end.toISOString().slice(0,10);
            vm.parameters.category.map(function(x){
                csv.categories=csv.categories?csv.categories+','+x.id:x.id;
            });
            vm.parameters.tag.map(function(x){
                csv.tags=csv.tags?csv.tags+','+x:x;
            })
            vm.parameters.campaign.map(function(x){
                csv.campaign_ids=csv.campaign_ids?csv.campaign_ids+','+x.id:x.id;
            })
            vm.parameters.coupon.map(function(x){
                csv.coupon_codes=csv.coupon_codes?csv.coupon_codes+','+x:x;
            })
            vm.loading = true;
            waitForCSV(csv);
        }
        function waitForCSV(csv){
            if(vm.loading){
            Profile.filterCsv(csv).then(function(res){
                if(res.status===200){
                    vm.loading = false;
                    if(res.data){
                        Utils.csvDownload(res.data,'Buyers_Segments');
                    }
                    else{
                        UINotification.error("No result found...");
                    }
                }
                else if(vm.loading){
                    $timeout(function(){waitForCSV(csv);},5000);
                }
            }).catch(function(err){
                vm.loading = false;
                UINotification.error(err.data.message);
            })
        }
        }
        function cance(){
            vm.loading = false;
        }
    }]);    