app.controller('campaignCtrl', ['Discount', 'Profile', 'Cards', 'CardVariation', 'UINotification','Utils','$timeout','$mdDialog', '$state', '$stateParams', '$scope',
    function (Discount, Profile, Cards, CardVariation, UINotification, Utils, $timeout, $mdDialog, $state, $stateParams, $scope) {
        var vm = this;
        vm.campaignId = $stateParams.campaign;
        vm.campaignType = $stateParams.campaignType;
        vm.changePage = changePage;
        vm.addCoupon = addCoupon;
        vm.removePriceRule = removePriceRule;
        vm.addPriceRule = addPriceRule;
        vm.getCategory = getCategory;
        //vm.search = search;
        vm.selectCategory = selectCategory;
        vm.removeCategory = removeCategory;
        vm.removeCreator = removeCreator;
        vm.setCreatorFilter = setCreatorFilter;
        vm.selectCreatorFilter = selectCreatorFilter;
        vm.searchCreators = searchCreators;
        vm.createPriceRule = createPriceRule;
        vm.createCampaign = createCampaign;
        vm.saveCampaign = saveCampaign;
        vm.stateCampaign = stateCampaign;
        vm.couponCsv = couponCsv;
        vm.generateCoupons = generateCoupons;
        vm.massiveCsv =massiveCsv;

        vm.selectedCategories = [];
        vm.selectedCreators = [];
        vm.newCampaign = false;
        vm.searchText = null;
        vm.searchText2 = null;
        vm.loading = false;
        vm.loadingPage = false;
        vm.downloading = false;
        vm.saving = false;
        vm.couponType = null;
        vm.campaign = null;
        vm.coupon = null;
        vm.coupons = [];
        vm.categoryList = null;
        vm.generating= false;
        vm.csvStart = 0;
        vm.csvEnd = 2000;
        vm.creatorList = [];
        vm.formats = ["A5" ,"NOTEBOOK" ,"SOCKS" ,"CHOCOLATE"];
        vm.page = 0;
        vm.maxpage=0;
        vm.csvpageResult = 0;

        vm.percentage = 0;
        vm.day = 24 * 60 * 60 * 1000;
        if(vm.campaignId==='new'){
            vm.newCampaign = true;
                vm.campaign={
                    start: new Date(),
                    end: new Date(new Date().getTime() +60*vm.day),
                    redemptions_per_user: -1,
                    only_first_order:true,
                    discount_rule:{
                        card_filter:{},
                        discount_target:'PRODUCT',
                        price_rules:[]
                    },
                };
                if(vm.campaignType === "credits"){
                    vm.campaign.campaign_type="CREDIT_COUPON_CAMPAIGN";
                    vm.campaign.redeemer_credit={amount:100,yearly_credit: true};
                }
                else if(vm.campaignType === "coupon"){
                    vm.campaign.campaign_type="COUPON_CAMPAIGN";
                }
                else if(vm.campaignType === "basket"){
                    vm.campaign.campaign_type="SIMPLE_DISCOUNT_CAMPAIGN";
                }
                else if(vm.campaignType === "referral"){
                    vm.campaign.campaign_type="REFERRAL_COUPON_CAMPAIGN";
                    vm.campaign.issuer_credit={amount:100,yearly_credit: true};
                }
            setRedeemerCredit();
        }
        else{
            getCampaign();
            if(vm.campaignType === "credits"||vm.campaignType === "coupon"){
                vm.loadingPage = true;
                getCoupon();
            }
            getCategory();
            getFormat();
        }
        function getCampaign() {
                    Discount.getCampaign(vm.campaignType,vm.campaignId).then(function (res) {
                        vm.campaign = res;
                        editCampaign();
                }).catch(function (err) {
                    UINotification.error(err.data.message);
                });
            
        }
        function getCoupon() {
            vm.loading = true;
            Discount.getSingleCoupon(vm.campaignId, vm.page).then(function (res) {
                vm.coupon = res;
                vm.loading = false;
                vm.loadingPage = false;
                vm.maxpage= res.total_pages;
                getCreators();
            }).catch(function (err) {
                vm.loading = false;
                vm.loadingPage = false;
            });
        }
        function getCreators() {
            vm.coupon.coupons.map(function (x) {
                if (typeof x.creator_profile_id === 'string') {

                    Profile.get(x.creator_profile_id).then(function (res) {
                        x.creator_profile_id = res;
                    })
                }
            })
        }
        function changePage(query) {
            vm.page = query
            getCoupon();
        }
        function addCoupon(name, code, perUser, useLimit) {
            vm.newCoupon = {
                name: name,
                code: code,
                redemptions_per_user: perUser,
                global_use: useLimit,
                
                state: vm.campaign.campaign_state,
            };
            vm.newCoupon.coupon_type = vm.campaignType === "credits"?"CREDIT":"SIMPLE_COUPON";

            Discount.addCoupon(vm.newCoupon, vm.campaignId).then(function (res) {
                getCoupon();
                UINotification.success("New Coupon Created!");
            }).catch(function (err) {
                UINotification.error(err.data.message);
            })

        }
        function removePriceRule(query) {
            vm.campaign.discount_rule.price_rules.splice(query, 1);
        }
        function addPriceRule() {
            var newPrice = {
                show_suggestion_trigger: 0
            }
            if (vm.campaign.discount_rule.price_rule_filter_type === 'PRODUCT_VALUE') {
                newPrice.min_products_value = 2.99;
            } else {
                newPrice.min_card_number = 1;
                newPrice.max_card_number = 3;
            }
            if (vm.campaign.discount_rule.price_rule_type === 'PERCENTAGE_OFF') {

                newPrice.percentage_off = 30;

            } else if (vm.campaign.discount_rule.price_rule_type === 'DISCOUNT_AMOUNT') {

                newPrice.discount_amounts = [{ amount: 0.75, currency: "GBP" }];

            } else {
                newPrice.new_prices = [{ amount: 0.75, currency: "GBP" }];
            }
            vm.campaign.discount_rule.price_rules.push(newPrice);
        }
        function setDate() {
            vm.campaign.start = vm.campaign.start ? new Date(vm.campaign.start) : new Date();
            vm.campaign.end = vm.campaign.end ? new Date(vm.campaign.end) : new Date();
            if(vm.campaign.redeemer_credit){
                vm.campaign.redeemer_credit.expiry_date = vm.campaign.redeemer_credit.expiry_date ? new Date(vm.campaign.redeemer_credit.expiry_date) : null;
            }
        }
        function setRedeemerCredit() {
            if(vm.campaign.redeemer_credit)
            {
                if (vm.campaign.redeemer_credit.expiry_date) {
                    vm.redeemerType = 'Expiry Date';
                } else if (vm.campaign.redeemer_credit.days_ahead) {
                    vm.redeemerType = 'Days Ahead';
                } else {
                    vm.redeemerType = 'Yearly';
                }
            }
        }
        function editCampaign() {
            setDate();
            setRedeemerCredit();
            setCategories();
            setCreatorFilter();
        }
        function getCategory() {
            Cards.getCategories().then(function (res) {
                vm.categoryList = res;
                setCategories();
            })
        }
        function searchCreators() {
            vm.creatorList = [];
            if (vm.searchText2&&vm.searchText2.length>1) {
                    return Profile.search(vm.searchText2).then(function (res) {
                        vm.creatorList = [];
                        res.profiles.map(function(x){
                            if(x.creator_tier){
                                vm.creatorList.push(x);
                            }
                        });
                            return vm.creatorList;
                    }).catch(function (err) {
                        return vm.creatorList;
                    });
            }
            else {
                return vm.creatorList;
            }
        }
        function setCategories(){
            vm.selectedCategories =[];
            if(vm.categoryList&&vm.campaign){
                vm.categoryList.map(function(x){
                    if(vm.campaign.discount_rule.card_filter.categories.includes(x.id))
                    {
                        vm.selectedCategories.push({id:x.id,title:x.title})
                    }
                })
            }
        }
        function selectCategory(query){
            if(query){
                if(!vm.campaign.discount_rule.card_filter.categories.includes(query.id)){
                    vm.campaign.discount_rule.card_filter.categories.push(query.id);
                    vm.selectedCategories.push({id:query.id,title:query.title});
                }
                    vm.searchText = null;
            }
        }
        function removeCategory(query){
            vm.campaign.discount_rule.card_filter.categories
            .splice(vm.campaign.discount_rule.card_filter.categories.indexOf(query.id), 1)
            vm.selectedCategories.splice(vm.selectedCategories.indexOf(query),1);
        }
        function setCreatorFilter(){
            vm.selectedCreators = [];
            vm.campaign.discount_rule.card_filter.creators.map(function(x){
                    Profile.get(x).then(function (res) {
                    vm.selectedCreators.push(res);
                    })
            })
        }
        function selectCreatorFilter(query){
            if(query){
                if(!vm.campaign.discount_rule.card_filter.creators.includes(query.id)){
                    vm.campaign.discount_rule.card_filter.creators.push(query.id);
                    vm.selectedCreators.push(query);
                }
                    vm.searchText2 = null;
            }
        }
        function removeCreator(query){
            vm.campaign.discount_rule.card_filter.creators
            .splice(vm.campaign.discount_rule.card_filter.creators.indexOf(query.id), 1)
            vm.selectedCreators.splice(vm.selectedCreators.indexOf(query),1);
        }
        function createPriceRule(){
            vm.campaign.discount_rule.price_rules = [];
            if(vm.campaign.discount_rule.price_rule_type&&vm.campaign.discount_rule.price_rule_filter_type){
                addPriceRule();
            }
        }
        function createCampaign(){
            vm.campaign.campaign_state="ENABLED";
            Discount.createCampaign(vm.campaignType,vm.campaign).then(function (res) {
                        $state.go('marketing.campaign',{campaignType: vm.campaignType ,campaign: res.id});
                    });
        }
        function saveCampaign(){
            vm.saving = true;
            vm.campaign.categories = [];
            Discount.saveCampaign(vm.campaignType,vm.campaign).then(function (res) {
                        vm.campaign = res;
                        editCampaign();
                        vm.saving = false;
                        UINotification.success("Campaign updated Successfully!");
            }).catch(function (err) {
                vm.saving = false;
                UINotification.error(err.data.message);
            });
        }
        function stateCampaign(){
            if(vm.campaign.campaign_state==="ENABLED"){
                vm.campaign.campaign_state ="DISABLED"
            }
            else {
                vm.campaign.campaign_state="ENABLED";
            }
            saveCampaign();
        }
        function getcsv(){
            var json = vm.coupons
            var fields = Object.keys(json[0])
            var replacer = function(key, value) { return value === null ? '' : value } 
            var csv = json.map(function(row){
            return fields.map(function(fieldName){
                return JSON.stringify(row[fieldName], replacer)
            }).join(',')
            })
            csv.unshift(fields.join(',')) // add header column
            csv=csv.join('\r\n')
            Utils.csvDownload(csv,'coupon')
            vm.coupons = [];
            vm.downloading = false;
            vm.percentage = 0;
        }
        function couponCsv(page){
                vm.downloading = true;
                Discount.getCouponCSV(vm.campaignId, page).then(function (res) {
                        res.coupons.map(function(x){
                                vm.coupons.push(x)
                        })
                        vm.csvpageResult++;
                        vm.csvEnd = vm.csvEnd>res.total_pages?res.total_pages:vm.csvEnd;
                        vm.percentage = ((vm.csvpageResult)/vm.csvEnd*100).toFixed(2);
                        if(vm.csvpageResult>=vm.csvEnd){
                            getcsv();
                        }
                    }).catch(function (err) {
                        vm.downloading = false;
                    });
        }
        function generateCoupons(name,perUser,useLimit,length,quantity){
            var text = 'Name: '+ name +' Per User: '+' Use Limit: ' + useLimit
            + ' Code Length: ' + length;

            var confirm = $mdDialog.confirm()
            .title('Would you like to generate '+quantity+' coupons?'
                +' Please do not refresh until the process is done!')
            .textContent(text)
            .ariaLabel('Coupon Generator')
            .targetEvent()
            .ok('YES')
            .cancel('NO');
            $mdDialog.show(confirm).then(function() {
                var coupons = {
                    quantity : quantity,
                    name : name,
                    redemptions_per_user : perUser,
                    global_use : useLimit,
                    coupon_state : "ENABLED",
                    coupon_length: length
                }
                vm.generating= true;
                generateCouponsRequest(coupons);
            }, function() {
            UINotification.success("Your action rejected");
            });
            
          
        }
        function generateCouponsRequest(coupons){
            Discount.generateCoupons(coupons,vm.campaignId).then(function (res) {
                if(res){

                    UINotification.success("Coupons created successfully!");
                    vm.coupons=res.coupons;
                    getcsv();
                    getCoupon();
                    vm.generating= false;
                }else{
                    $timeout(function(){generateCouponsRequest(coupons);},5000);
                }
            }).catch(function (err) {
                UINotification.error(err.data.message);        
                if(err.code==400){
                    vm.generating= false;                    
                    return; 
                }
                $timeout(function(){generateCouponsRequest(coupons);},5000);
            });
        }
        function massiveCsv(){
            vm.csvpageResult=vm.csvStart;
            vm.csvEnd = vm.csvEnd>vm.maxpage?vm.maxpage:vm.csvEnd;
        for(i=vm.csvpageResult;i<vm.csvEnd;i++){
                couponCsv(i);
        }
        }
        function getFormat(){
            CardVariation.getSettings().then(function (res){
                vm.formats = res.printer_format;
            })
        }
    }]);
    