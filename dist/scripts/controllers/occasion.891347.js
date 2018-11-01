app.controller('occasionCtrl', ['Categories','Utils','$mdDialog','$state','$stateParams','UINotification', '$scope',
                    function(Categories,Utils,$mdDialog,$state,$stateParams,UINotification,$scope) {
    var vm = this;
    vm.active = active;
    vm.arrow = arrow;
    vm.collapseNext = collapseNext;
    vm.createFilter = createFilter;
    vm.editFilter = editFilter;
    vm.deleteFilter = deleteFilter;
    vm.loadImage = loadImage;
    vm.answer = answer;
    vm.addItem = addItem;
    vm.removeItem = removeItem;
    vm.uploadImage = uploadImage;
    vm.saveCategory = saveCategory;
    vm.createCategory = createCategory;
    vm.updateImage = updateImage;
    vm.changeStatus = changeStatus;
    vm.deleteImage = deleteImage;
    vm.queryCheck = queryCheck;
    
    vm.selectedTab = [];
    vm.reminderType =[
        { name: 'Birthday', val: 'BIRTHDAY' },
        { name: 'Mother\'s Day', val: 'MOTHERS_DAY' },
        { name: 'Father\'s Day', val: 'FATHERS_DAY' },
        { name: 'Christmas', val: 'CHRISTMAS' },
        { name: 'Easter', val: 'EASTER' },
        { name: 'Valentine\'s Day', val: 'VALENTINES_DAY' },
        { name: 'Other', val: 'OTHER' }
      ];
    vm.collapse = false;
    vm.tab= [];
    vm.categories = [];
    vm.ready = false;
    vm.test = "";
    vm.selected= 'rank';
    vm.reverse = null;
    vm.categoryId = $stateParams.id;
    vm.category = {};
    vm.text = {};
    vm.image = false;
    vm.categoryImage = false;
    if(vm.categoryId){
        getCategory();
        vm.image_nameList=["desktop","desktop-large","mobile","mobile-large","tablet"];
        vm.image_sizeList=["DESKTOP","MOBILE","TABLET"];
        vm.platform_typeList=["WEB","IOS","API"];
        vm.imageName=[];
        vm.imageGroup={
            image_name : null,
            image_size : vm.image_sizeList[0],
            platform_type : vm.platform_typeList[0],
            image : null
        }
    }else{
        getCategories();
    }
    function getCategory(){
        if(vm.categoryId==='new'){
            vm.category = {
                title: null,
                rank: 0,
                visible: false,
                category_filter_ids : [],
                generic_searches_excluded : false
              };
              vm.ready = true;
        }else{
            Categories.getCategory(vm.categoryId).then(function(res){
                vm.category = res;
                vm.ready = true;
            }).catch(function(err) {
                vm.ready = true;
                UINotification.error(err.data.message);
            })
        }
    }
    function getCategories(){
        Categories.getCategories().then(function(res){
            vm.categories = res;
            vm.ready=true;
        }).catch(function(err) {
            vm.ready = true;
            UINotification.error(err.data.message);
        })
    }
    function active(query){
        if(query===vm.selected&&!vm.reverse)
        {
            vm.reverse = "reverse";
        }else{
            vm.selected =query;
            vm.reverse = null;
        }
    }
    function arrow(query){
        if(vm.selected===query){
            if(vm.reverse){
                return "mdi-navigation-arrow-drop-up"
            }
            return "mdi-navigation-arrow-drop-down"
        }
    }
    function collapseNext($event) {
        angular.element($event.currentTarget).next().collapse('toggle');
    }
    function createFilter(filter){
        var filter = {
            title:"New Filter",
            tags:[],
        };
        editFilter(filter);
    }
    function editFilter(filter){
        vm.ev = angular.copy(filter);
        vm.image = false;
        $mdDialog.show({
            controller: function () {
                return vm;
            },
            controllerAs: 'vm',
            templateUrl: 'FilterDialog.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: vm.ev,
            clickOutsideToClose: true,
            local: { ev: vm.ev }
        })
        .then(function (answer) {
            if (answer) {
                if (vm.ev.id) {
                    Categories.updateCategoryFilter(vm.image,vm.ev).then(function(res){
                        saveCategory();
                        UINotification.success('Filter Updated');
                    }).catch(function(err) {
                        UINotification.error(err.data.message);
                    })
                }
                else {
                    Categories.createCategoryFilter(vm.image,vm.ev,vm.categoryId).then(function(res){
                        vm.category.category_filters.push(res);
                        vm.category.category_filter_ids.push(res.id);
                        UINotification.success('Filter Created');
                        saveCategory();
                    }).catch(function(err) {
                        UINotification.error(err.data.message);
                    })
                }
            }
            }, function () {

            }
        );
        
    }
    function answer(answer) {
        $mdDialog.hide(answer);
    }
    function loadImage(id,outpout){
        var image = document.getElementById(id).files[0];
        var output = document.getElementById(outpout);
        output.src = URL.createObjectURL(image);
        if(id==="group_image_file"){
            vm.imageGroup.image = image;
        }
        else if(id==="category_image"){
            vm.categoryImage = image;
        }else{
            vm.image = image;
        }
        getCategories();
    }
    function addItem(item, place) {
        if (item) {
            if (!place.includes(item)) {
                place.push(item);
            }
            vm.text = {};
        }
    }
    function removeItem(item, place) {
        place.splice(place.indexOf(item), 1);
    }
    function deleteFilter(filter){

        var confirm = $mdDialog.confirm()
        .title('Would you like to delete this Suggested Filter?')
        .textContent(filter.title)
        .ariaLabel('Delete filter')
        .targetEvent(filter)
        .ok('YES')
        .cancel('NO');
      $mdDialog.show(confirm).then(function() {
        Categories.deleteCategoryFilter(filter.id).then(function(res){
            UINotification.success('Filter deleted');
            vm.category.category_filters.splice(vm.category.category_filters.indexOf(filter), 1);
            vm.category.category_filter_ids.splice(vm.category.category_filters.indexOf(filter.id), 1);
            saveCategory();
        }).catch(function(err) {
            UINotification.error(err.data.message);
        })
      }, function() {
        UINotification.success("You didn't delete this Suggested Filter");
      });        
    }
    function uploadImage(){
        vm.imageName.map(function(x){
            vm.imageGroup.image_name = x;
            addCategoryImage();
        })
    }
    function addCategoryImage(){
        Categories.addCategoryImage(vm.imageGroup,vm.categoryId).then(function(res){
            vm.category = res;
            UINotification.success('Image uploaded');            
        }).catch(function(err) {
            UINotification.error(err.data.message);
        })
    }
    function saveCategory(){
        delete vm.category.image;
        vm.category.category_filter_ids = [];
        vm.category.category_filters.map(function(x){
            vm.category.category_filter_ids.push(x.id);
        })
        Categories.updateCategory(vm.category).then(function(res){
            vm.category = res;
            UINotification.success('Occasion Updated');            
        }).catch(function(err) {
            UINotification.error(err.data.message);
        })
    }
    function updateImage(){
        Categories.updateCategoryImage(vm.categoryImage,vm.categoryId).then(function(res){
            vm.category = res;
            UINotification.success('Occasion Updated');            
        }).catch(function(err) {
            UINotification.error(err.data.message);
        })
    }
    function deleteImage(image){
        var confirm = $mdDialog.confirm()
        .title('Would you like to delete this image?')
        .textContent(image.image_name+', '+image.image_size+', '+image.platform_type)
        .ariaLabel('Delete filter')
        .targetEvent(image)
        .ok('YES')
        .cancel('NO');
      $mdDialog.show(confirm).then(function() {
        Categories.deleteCategoryImage(image,vm.categoryId).then(function(res){
            //vm.category = res;
            UINotification.success('Image Deleted');
            vm.category.platform_images.splice(vm.category.platform_images.indexOf(image),1);
        }).catch(function(err) {
            UINotification.error(err.data.message);
        })
      }, function() {
        UINotification.success("You didn't delete this Image");
      });  
    }
    function changeStatus(){
        vm.category.visible = !vm.category.visible;
        saveCategory();
    }
    function createCategory(){
        vm.ready = false;
        Categories.createCategory(vm.categoryImage,vm.category).then(function(res){
            UINotification.success('Occasion Created');
            $state.go('content.occasion',{id: res.id});
        }).catch(function(err){
            vm.ready = true;
            UINotification.error(err.data.message);            
        })
    }
    function queryCheck(){
        return (vm.categoryImage&&vm.category.title&&vm.category.description&&vm.category.rank>=0)
    }
}]);