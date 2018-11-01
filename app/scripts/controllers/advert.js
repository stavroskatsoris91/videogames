app.controller('advertCtrl', ['Advert', 'Profile', 'Cards', 'UINotification','Utils','$timeout','$mdDialog', '$state', '$stateParams', '$scope',
    function (Advert, Profile, Cards, UINotification, Utils, $timeout, $mdDialog, $state, $stateParams, $scope) {
        var vm = this;
        vm.advertId = $stateParams.advert;
        vm.addItem = addItem;
        vm.removeItem = removeItem;
        vm.uploadImage = uploadImage;
        vm.saveAdvert = saveAdvert;
        vm.stateAdvert = stateAdvert;
        vm.createAdvert = createAdvert;
        vm.deleteImage = deleteImage;

        vm.advert = {};
        vm.filters = {
            categories:[],
            excluded_categories:[],
            excluded_tags:[],
            tags:[],
        };
        vm.platformImages={
            image:"",
            image_name:"desktop",
            image_size:"DESKTOP",
            platform_type:"WEB"
        }
        vm.text = {};
        vm.newAdvert = false;
        if(vm.advertId==='new'){
            vm.newAdvert = true;
            vm.advert = {
                content:{},
                advert_filter:{
                    tags:[],
                    excluded_tags:[]},
                action:{
                    type:""},
                priority:1,
                enabled:false,
                title:"",
                description:"",
                type:"",
                position:""
            };
        }else{
            getAdvert();
            getCategory();
        }
        function getAdvert(){
            Advert.getAdvert(vm.advertId).then(function (res) {
                vm.advert =res;
                //vm.filters = vm.advert.advert_filter;
                    vm.finish = true;
            });
        }
        function getCategory() {
            Cards.getCategories().then(function (res) {
                vm.categoryList = res;
                setCategories(vm.advert.advert_filter.categories,vm.filters.categories);
                setCategories(vm.advert.advert_filter.excluded_categories,vm.filters.excluded_categories);
            })
        }
        function setCategories(categoryId,categoryList){
            if(vm.categoryList&&categoryId){
                vm.categoryList.map(function(x){
                    if(categoryId.includes(x.id))
                    {
                        categoryList.push(x);
                    }
                })
            }
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
        function uploadImage(){
            vm.platformImages.image = document.getElementById('image_file').files[0];
            if(vm.platformImages.image){
                Advert.uploadImage(vm.advertId,vm.platformImages).then(function(res){
                    vm.advert=res;
                    UINotification.success("Image Updated");
                    
                }).catch(function(err){

                    UINotification.error(err.data.message?err.data.message:"hm, image is not accepted");
                })
            }else{
                    UINotification.error("Please select an image");
                
            }
        }
        function saveAdvert(){
            setFilters();
            Advert.updateAdvert(vm.advert).then(function(res){
                vm.advert=res;
                UINotification.success("Advert Updated");
                
            }).catch(function(err){
                UINotification.error("Something went wrong!");
            })
        }
        function stateAdvert(){
            vm.advert.enabled=!vm.advert.enabled;
            saveAdvert();
        }
        function createAdvert(){
            Advert.createAdvert(vm.advert).then(function(res){
                $state.go('marketing.advert',{advert: res.id});
            }).catch(function(err){
                UINotification.error(err.data.message);                
            })
        }
        function deleteImage(image){
            var confirm = $mdDialog.confirm()
            .title('Would you like to delete this image?')
            .textContent(image.image_name)
            .ariaLabel('Delete image')
            .targetEvent()
            .ok('YES')
            .cancel('NO');
            $mdDialog.show(confirm).then(function() {
                Advert.deleteImageAdvert(vm.advertId,image).then(function(res){
                    vm.advert=res;
                    UINotification.success("Image removed");
                    
                }).catch(function(err){
                UINotification.error(err.data.message);
                })
            }, function() {
                UINotification.success("Your action rejected");
            });
        }
        function setFilters(){
             Object.keys(vm.filters).forEach(function(list){
                 Object.keys(vm.advert.advert_filter).forEach(function(advert){
                     if(list===advert&&vm.filters[list]&&vm.filters[list][0]&&vm.filters[list][0].id){
                        vm.advert.advert_filter[advert]=[];
                         vm.filters[list].map(function(x){
                             vm.advert.advert_filter[advert].push(x.id);
                         })
                     }else if(list===advert){
                         vm.advert.advert_filter[advert]=vm.filters[list];
                     }
                 })
             })
        }
    }]);
    