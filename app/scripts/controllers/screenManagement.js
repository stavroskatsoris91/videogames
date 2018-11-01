app.controller('screenManagementCtrl', ['Screen','Categories', 'Utils', 'UINotification', '$mdDialog', '$state', '$stateParams', 'UINotification', '$scope',
    function (Screen,Categories , Utils, UINotification, $mdDialog, $state, $stateParams, UINotification, $scope) {
        var vm = this;


        vm.getScreens = getScreens;
        vm.createScreen = createScreen;
        vm.updateScreen = updateScreen;
        vm.screenId = $stateParams.id;
        vm.topCategory = topCategory;
        vm.addItem = addItem;
        vm.removeItem = removeItem;
        vm.removeParagraph = removeParagraph;

        vm.screens={};
        vm.screen = {};
        vm.screensImage='PHONE_PORTRAIT';
        vm.page = 0;
        vm.categories = {};
        vm.text={};
        vm.allDeviceUrl = false;
        vm.ready=false;
        getCategories();
        getScreens(0);
        function selectedScreen()
        {
            if(vm.screenId==="new"){
                vm.screen={
                    name:null,
                    title:null,
                    action:{
                        label:null,
                        kind:"EXPLORE",
                        criteria:{
                            keywords:[]
                        }
                    },
                    paragraphs:[],
                    images:{
                        ANDROIND_BIG:null,
                        ANDROID_SMALL:null,
                        IOS_BIG:null,
                        IOS_SMALL:null,
                        PHONE_PORTRAIT:null,
                        TABLET_LANDSCAPE:null,
                        TABLET_PORTRAIT:null
                    },
                    top_category_id:null}
        
            }else if(vm.screenId){
                vm.screens.data.map(function(x){
                    if(x.id===vm.screenId){
                        vm.screen = x;
                    }
                })
                if(!vm.screen.id){
                    $state.go('content.screens');
                }
            }
        }
        function getScreens(page){
            vm.page = page;
            Screen.getScreens(page).then(function(res){
                vm.screens = res;
                selectedScreen();
                console.log(res);
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function createScreen(){
            Screen.createScreen(vm.screen).then(function(res){
                UINotification.success("Screen created");
                $state.go('content.screen',{id:res.id});
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function updateScreen(){
            Screen.updateScreen(vm.screen).then(function(res){
                UINotification.success("Screen Updated");
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
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
        function topCategory(query){
            for(i=0;i< vm.categories.length;i++){
                if(vm.categories[i].id===query){
                    return vm.categories[i].title;
                }
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
        function removeParagraph(item,place) {
          var confirm = $mdDialog.confirm()
            .title('Would you like to delete this paragraph?')
            .textContent(item)
            .ariaLabel('Delete note')
            .targetEvent(item)
            .ok('YES')
            .cancel('NO');
          $mdDialog.show(confirm).then(function() {
            removeItem(item,place);
            UINotification.success("Paragraph deleted");
          }, function() {
            UINotification.success("Action Canceled");
          });
        }
    }]);