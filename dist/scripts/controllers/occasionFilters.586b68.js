app.controller('occasionFiltersCtrl', ['Categories','Utils','$mdDialog','$state','$stateParams','UINotification', '$scope', '$q',
                    function(Categories,Utils,$mdDialog,$state,$stateParams,UINotification,$scope,$q) {
    var vm = this;
    vm.list = {groups:[],filters:[]};
    vm.getCategoryName = getCategoryName;
    vm.getFilterName = getFilterName;
    vm.getFilterGroupName = getFilterGroupName;
    vm.closeDialog = closeDialog;
    vm.openDialog = openDialog;
    vm.saveGroup = saveGroup;
    vm.saveFilter = saveFilter;
    vm.addItem = addItem;
    vm.removeFilterItem = removeFilterItem;
    vm.deleteDialog = deleteDialog;
    vm.deleteItem = deleteItem;
    vm.newItem = newItem;
    vm.createNew = createNew;
    vm.newFilterInGroup = newFilterInGroup;
    vm.newFilter = newFilter;
    vm.selectAll = selectAll;

    var newGroup = {
        //"filters": [],
        "position": 0,
        "question": "question",
        "select_mode": '',
        "title": ''
    }
    var newFilter = {
        "label":"",
        "tag":"",
        "category_id":null,
        "excluded_categories":[],
        "excluded_filters":[],
        "filter_group_id":null,
        "selected":false,
        "no_match_excluded":false,
        "position":0,
        "type":""}
    var filtersToDelete = [];
    init();
    function init(){
        let filtersPromise = $q.defer();
        let groupsPromise = $q.defer();
        let categoriesPromise = $q.defer();

        let allPromises = [filtersPromise.promise,groupsPromise.promise,categoriesPromise.promise];

        Categories.getFilters().then(function(res){
            filtersPromise.resolve(res);
        }).catch(function(err){
            filtersPromise.reject("Error")
        })
        Categories.getGroups().then(function(res){
            groupsPromise.resolve(res);
        }).catch(function(err){
            groupsPromise.reject("Error")
        })
        Categories.getCategories().then(function(res){
            categoriesPromise.resolve(res);
        }).catch(function(err){
            categoriesPromise.reject("Error")
        })

        $q.all(allPromises).then(function(res) {
            vm.list.filters = res[0];
            vm.list.groups = res[1];
            vm.categories = res[2];

            vm.list.filters.map(function(y){
                y.groups = '';
                vm.list.groups.map(function(x){
                    if(x.id==y.filter_group_id){
                        y.groups = x.title;
                    }
                })
            })
        })
    }
    function getCategoryName(id){
        for(var i=0;i<vm.categories.length;i++){
            if(vm.categories[i].id==id){
                return vm.categories[i].title;
            }
        }
        return '';
    }
    function getFilterName(id){
        for(var i=0;i<vm.list.filters.length;i++){
            if(vm.list.filters[i].id==id){
                return vm.list.filters[i].label;
            }
        }
        return '';
    }
    function getFilterGroupName(id){
        for(var i=0;i<vm.list.groups.length;i++){
            if(vm.list.groups[i].id==id){
                return vm.list.groups[i].title;
            }
        }
        return '';
    }
    function closeDialog() {
        $mdDialog.cancel();
    }
    function openDialog(item){
        filtersToDelete = [];
        vm.item = angular.copy(item);
        if(vm.item.title!==undefined){
            vm.item.is_group = true;
        }
        vm.showNew = false;
        $mdDialog.show({
            //template:'<div ng-include="\'/views/dialog_templates/group_filters.5e9ce6.html\'" style="width: 600px;"></div>',
            templateUrl: '/views/dialog_templates/group_filters.5e9ce6.html',
            scope: $scope,
            preserveScope: true,
            clickOutsideToClose: true,          
            })
    }
    function deleteDialog(){
        vm.selectedItem = vm.item;
        $mdDialog.show({
            template:
                '<md-dialog aria-label="Delete {{vm.selectedItem.is_group?\'Group\':\'Filter\'}}">' +
                    '<div layout-padding layout="column">' +
                        '<md-title class="h3">Delete {{vm.selectedItem.label?vm.selectedItem.label:vm.selectedItem.title}}?</md-title>' +
                        '<p class="text-center">' +
                            '<md-button ng-click="vm.closeDialog()" class="btn btn-default">No</md-button>' +
                            '<md-button ng-click="vm.deleteItem(vm.selectedItem)" class="btn btn-primary">Yes</md-button>  ' +
                        '</p>' +
                    '</div>'+
                '</md-dialog>',
            scope: $scope,
            preserveScope: true,
        })
    }
    function deleteItem(item){
        if(item.is_group){
            Categories.deleteFilterGroup(item.id).then(function(res){
                init();
                UINotification.success('Group deleted');
                closeDialog();
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }else{
            Categories.deleteFilter(item.id).then(function(res){
                init();
                UINotification.success('Filter deleted');
                closeDialog();
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
    }
    function addItem(item,place,id){
        if(vm.text){
            if(!id){
                var exists = false;
                place.map(function(x){
                    if(item.id==x.id){
                        exists = true;
                    }
                })
                if(!exists){
                    place.push(item);
                }
            }
            else if(item.id!=vm.item.id&&place.indexOf(item.id)==-1){
                place.push(item.id);
            }
            vm.text='';
        }
    }
    function selectAll(){
        vm.item.excluded_categories = [];
        vm.categories.map(function(x){
            vm.item.excluded_categories.push(x.id);
        })
    }
    function removeFilterItem(item,place){
        place.splice(place.indexOf(item), 1);
        filtersToDelete.push(item.id);
    }
    function saveGroup(item){
        if(item.id){
            let promises = {};
            let allPromises = [];
            item.filters.map(function(x,index){
                if(x.filter_group_id!==item.id){
                    promises['create'+index]=$q.defer();
                    allPromises.push( promises['create'+index].promise);
                    x.filter_group_id = item.id;
                    saveFilter(x,promises['create'+index]);
                }
                if(filtersToDelete.indexOf(x.id)>-1)
                    filtersToDelete.splice(filtersToDelete.indexOf(x.id), 1);      
            })
            filtersToDelete.map(function(x,index){
                promises['delete'+index]=$q.defer();
                allPromises.push( promises['delete'+index].promise);
                deleteFilterInGroup(x,promises['delete'+index]);
            })

            $q.all(allPromises).then(function(res) {
                Categories.updateFilterGroup(item).then(function(res){
                    init();
                    UINotification.success('Group updated');
                    closeDialog();
                }).catch(function(err){
                    UINotification.error(err.data.message);
                })
            })
        }
        else{
            Categories.createFilterGroup(item).then(function(res){
                init();
                UINotification.success('Group created');
                closeDialog();
            }).catch(function(err){
                UINotification.error(err.data.message);
            }) 
        }
    }
    function saveFilter(item,promise){
        if(item.id){
            Categories.updateFilter(item).then(function(res){
                if(promise){
                    promise.resolve(res);
                }else{
                    init();
                    UINotification.success('Filter updated');
                    closeDialog();
                }
            }).catch(function(err){
                if(promise){
                    promise.reject("Error");
                }
                UINotification.error(err.data.message);
            })
        }
        else{
            Categories.createFilter(item).then(function(res){
                init();
                UINotification.success('Filter created');
                closeDialog();
            }).catch(function(err){
                UINotification.error(err.data.message);
            }) 
        }
    }
    function createNew(id){
        vm.newFilter = angular.copy(newFilter);
        vm.newFilter.filter_group_id=id;
        vm.showNew = true;
    }
    function newFilterInGroup(item){
        Categories.createFilter(item).then(function(res){
            init();
            vm.item.filters.push(res);
            vm.showNew=false;
            UINotification.success('Filter created');
        }).catch(function(err){
            UINotification.error(err.data.message);
        }) 
    }
    function deleteFilterInGroup(id,promise){
        Categories.deleteFilter(id).then(function(res){
            promise.resolve(res);
        }).catch(function(err){
            promise.reject("Error");
            UINotification.error(err.data.message);
        })
    }
    function newItem(item){
        if(item=='group'){
            openDialog(newGroup);
        }else if(item=='filter'){
            openDialog(newFilter);
        }

    }
}]);