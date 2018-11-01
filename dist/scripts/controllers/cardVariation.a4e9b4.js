app.controller('cardVariationCtrl', ['CardVariation', 'Cards', 'Utils', 'UINotification', '$mdDialog', '$state', '$stateParams', 'UINotification', '$scope',
    function (CardVariation, Cards, Utils, UINotification, $mdDialog, $state, $stateParams, UINotification, $scope) {
        var vm = this;
        vm.active = active;
        vm.arrow = arrow;
        vm.updateVariation = updateVariation;
        vm.addItem = addItem;
        vm.removeItem = removeItem;
        vm.categoryName = categoryName;
        vm.loadImage = loadImage;
        vm.uploadImage = uploadImage;
        vm.deleteImage = deleteImage;
        vm.deleteCardVariation = deleteCardVariation;
        vm.createCardVariation = createCardVariation;
        vm.updateImage = updateImage;
        vm.selectedVar = selectedVar;
        vm.changeRank = changeRank;
        vm.deleteAsset = deleteAsset;
        vm.updateAsset = updateAsset;
        vm.saveAsset = saveAsset;
        vm.selectedOccasion = selectedOccasion;        
        
        vm.variationList = [];
        vm.variationId = $stateParams.id;
        vm.variation = {};
        vm.asset = {};
        vm.selectedVariation = {};
        vm.text={};
        vm.formatList = [];
        vm.categoryList = [];
        vm.imageName = [];
        vm.addAsset = false;
        vm.orientations = ['PORTRAIT','LANDSCAPE'];
        vm.platform_typeList=["WEB","IOS","API","ANDROID"];
        vm.image_sizeList=["DESKTOP","MOBILE","TABLET"];
        vm.image_nameList=["default","desktop","desktop-large","mobile","mobile-large","tablet"];
        
        vm.reverse = null;
        vm.test = "";
        vm.selected= "rank";
        vm.ready = false;
        var newAsset =[];

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
        
        
        function getCategoriesSearchGroup() {
            Categories.getCategoriesSearchGroup().then(function (res) {
                vm.groups = res;
            })
        }
        function getCategory(type) {
            Cards.getCategories().then(function (res) {
                vm.categoryList = res;
                if(type==='new'){
                    var idList = [];
                    res.map(function(x){
                        vm.variation.occasion_filter.push(x.id);
                    })

                }
            }).catch(function(err){
                
            })
        }
        if(vm.variationId){
           
            
            getSettings();
            if(vm.variationId==='new'){
                vm.ready = true;
                vm.variation = {
                    name : null ,
                    format : null,
                    printer_info : {template_id : 1},
                    orientations : [],
                    description: {bullet_points :[]},
                    occasion_filter: [],
                    style : {style_name : null},
                    assets:[{
                        name : 'default_image',
                        images : [],
                    },
                    {
                        name : 'default_thumb',
                        images : [],
                    }],
                }
                getCategory('new');
            }else{
                getCategory();
                CardVariation.get(vm.variationId).then(function(res){
                vm.ready = true;
                vm.variation = res;
                initializeImageGroup();
                }).catch(function(err){
                    UINotification.error(err.data.message);                
                    $state.go('content.cardVariation',{id:null});                    
                })

            }
        }else{
            variationList();
        }
        function variationList(){
            CardVariation.getAll().then(function(res){
                vm.ready = true;
                vm.variationList = res;
            })
        }
        function selectedVar(varioation){
            vm.selectedVariation = varioation;

        }
        function changeRank(variation){
            if(vm.selectedVariation.rank!==variation.rank){
                if(vm.selectedVariation.rank <variation.rank){
                    vm.selectedVariation.rank =variation.rank+1;
                }else{
                    vm.selectedVariation.rank =variation.rank-1;
                }
                updateVariation(vm.selectedVariation);
            }
            vm.selectedVariation = {};
        }
        var occasion = {
            selected : -1,
            down:false,
            change:false,
        }
        function selectedOccasion(index,down,list,edit){
            if(!edit)
            {
                document.getSelection().removeAllRanges();
            }
            if(down===true){
                occasion.selected = index;
                occasion.down = true;
            }
            if(down=== 'over'&&occasion.down){
                if(index!=occasion.selected){
                    var item = list[occasion.selected];
                    if(occasion.selected<index){
                        index+=1;
                    }
                    list.splice(occasion.selected,1);
                    list.splice(index,0,item);
                    occasion.selected = index<list.length?index:list.length-1;
                }
            }
            if(!down){
                occasion.down = false;
            }
        }
        function updateVariation(variation){
            var update = {};
            if(variation){
                update = angular.copy(variation);
                update.assets = [];
            }else{
                update = angular.copy(vm.variation);
                update.assets = newAsset;
            }
            CardVariation.updateCardVariation(update).then(function(res){
                vm.variation = res;
                UINotification.success('Card Variation Updated');
                
            }).catch(function(err){
                variationList();
                UINotification.error(err.data.message);
            })
        }
        function getSettings(){
            CardVariation.getSettings().then(function(res){
                vm.formatList =res.printer_format;
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
        function removeItem(item,place){
            place.splice(place.indexOf(item), 1);
        }
        function categoryName(id){
            for(var i=0;i<vm.categoryList.length;i++){
                if(vm.categoryList[i].id===id){
                    return vm.categoryList[i].title;
                }
            }
        }
        function loadImage(id,outpout){
            if(outpout){
                var image = document.getElementById(id+vm.selectedAsset).files[0];
                var output = document.getElementById(outpout+vm.selectedAsset);
                output.src = URL.createObjectURL(image);
                vm.imageGroup.image = image;
                getCategory();
            }else{
                vm.singleImage.card_variation_id = vm.variationId;
                vm.assetId = vm.singleImage.asset_id;
                vm.singleImage.image = document.getElementById(id).files[0];;
                    CardVariation.createAssetImage(vm.singleImage).then(function(res){
                        UINotification.success('New Image Created!');
                        res.assets.map(function(x){
                            if(x.asset_id===vm.assetId){
                                vm.asset = x;
                            }
                        })
                        vm.variation.assets.map(function(y){
                            if(y.asset_id===vm.asset.asset_id){
                                y.images = vm.asset.images;
                            }
                        })
                    }).catch(function(err){
                        UINotification.error(err.data.message);                
                    })
                initializeImageGroup();
            }
        }
        function initializeImageGroup(){
            var image = document.getElementById('group_image_file');
            var output = document.getElementById('group_image_output');
            if(output){
                image.files[0] = null;
                image.value = null;    
                output.src = null;

            }
            vm.imageName = [];
            vm.imageGroup = {
                platform_type : vm.platform_typeList[0],
                image_size : vm.image_sizeList[0],
                image_name :null,
                image : null,
                asset_id : null,
                card_variation_id : null,
            }
        }
        function uploadImage(assetId){
            vm.imageGroup.card_variation_id = vm.variationId;
            vm.imageGroup.asset_id = assetId;
            vm.assetId =assetId;
            vm.imageName.map(function(x){
                vm.imageGroup.image_name = x;

                CardVariation.createAssetImage(vm.imageGroup).then(function(res){
                    UINotification.success('New Image Created!');
                    res.assets.map(function(x){
                        if(x.asset_id===vm.assetId){
                            vm.asset = x;
                        }
                    })
                    vm.variation.assets.map(function(y){
                        if(y.asset_id===vm.asset.asset_id){
                            y.images = vm.asset.images;
                        }
                    })
                }).catch(function(err){
                    UINotification.error(err.data.message);                
                })
            })
            initializeImageGroup();

        }
        function updateImage(image,assetId){
            vm.singleImage = image;
            vm.singleImage.asset_id = assetId;
            document.getElementById('singleImage').click();
        }
        function deleteImage(image,assetId){
            vm.assetId = assetId;
            var confirm = $mdDialog.confirm()
            .title('Would you like to delete this image?')
            .textContent(image.image_name)
            .ariaLabel('Delete image')
            .targetEvent()
            .ok('YES')
            .cancel('NO');
            $mdDialog.show(confirm).then(function() {
                image.card_variation_id = vm.variationId;
                image.asset_id = assetId;
                CardVariation.deleteAssetImage(image).then(function(res){
                    UINotification.success("Image Deleted");
                    res.assets.map(function(x){
                        if(x.asset_id===vm.assetId){
                            vm.asset = x;
                        }
                    })
                    vm.variation.assets.map(function(y){
                        if(y.asset_id===vm.asset.asset_id){
                            y.images = vm.asset.images;
                        }
                    })
                }).catch(function(err){
                UINotification.error(err.data.message);
                })
            }, function() {
                UINotification.success("Your action rejected");
            });

        }
        function deleteCardVariation(variation){
            var confirm = $mdDialog.confirm()
            .title('Would you like to delete this Card Variation?')
            .textContent(variation.name)
            .ariaLabel('Delete variation')
            .targetEvent()
            .ok('YES')
            .cancel('NO');
            $mdDialog.show(confirm).then(function() {
                CardVariation.deleteCardVariation(variation.id).then(function(res){
                    UINotification.success("Card Variation Deleted");                
                    removeItem(variation,vm.variationList);
                }).catch(function(err){
                UINotification.error(err.data.message);
                })
            }, function() {
                UINotification.success("Your action rejected");
            });
        }
        function deleteAsset(asset,index){
            if(asset.asset_id){
                CardVariation.deleteAsset(asset,vm.variationId).then(function(res){
                    UINotification.success("Asset Deleted");
                    vm.variation.assets.splice(index,1);
                }).catch(function(err){
                UINotification.error(err.data.message);
                })
            }else{
                vm.variation.assets.splice(index,1);            
            }
        }
        function updateAsset(asset){
            CardVariation.updateAsset(asset,vm.variationId).then(function(res){
                UINotification.success("Asset Saved");
            }).catch(function(err){
            UINotification.error(err.data.message);
            })
        }
        function createCardVariation(){
            CardVariation.createCardVariation(vm.variation).then(function(res){
                UINotification.success("New Card Variation Created");                
                $state.go('content.cardVariation',{id:res.id});
            }).catch(function(err){
                UINotification.error(err.data.message);
                
            })
        }
        function saveAsset(name){
            vm.addAsset = false;
            newAsset.push({name:name,images:[]});
            updateVariation();
            newAsset =[];
        }
    }]);