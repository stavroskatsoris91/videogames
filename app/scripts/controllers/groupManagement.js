app.controller('groupManagementCtrl', ['Categories', 'Cards', 'Utils', 'UINotification', '$mdDialog', '$state', '$stateParams', 'UINotification', '$scope',
    function (Categories, Cards, Utils, UINotification, $mdDialog, $state, $stateParams, UINotification, $scope) {
        var vm = this;
        vm.colour = colour;
        vm.isOpen = isOpen;
        vm.collapseNext = collapseNext;
        vm.createGroup = createGroup;
        vm.editGroup = editGroup;
        vm.answer = answer;
        vm.createCategory = createCategory;
        vm.addItem = addItem;
        vm.removeItem = removeItem;
        vm.categoryTitle = categoryTitle;
        vm.updateImage = updateImage;
        vm.loadImage = loadImage;
        vm.colourOver = colourOver;
        vm.colourLeave = colourLeave;
        vm.deleteQuery = deleteQuery;

        vm.selectedGroup = {};
        vm.selectedTab = [];
        vm.selectedColour ='';
        vm.textColour ='';
        vm.collapse = false;
        vm.tab = [];
        vm.groups = [];
        vm.queries = [];
        vm.image = false;
        vm.categoryList= [];
        vm.ev = {};
        vm.text = {};
        getCategoriesSearchGroup();
        getCategory();
        function getCategoriesSearchGroup() {
            Categories.getCategoriesSearchGroup().then(function (res) {
                vm.groups = res;
            })
        }
        function getCategory() {
            Cards.getCategories().then(function (res) {
                vm.categoryList = res;
            })
        }
        function colour(query) {
            if (vm.collapse||!vm.selectedTab[query]) {
                vm.collapse = false;
                vm.queries = [];
                return vm.selectedTab[query] = "";
            }
            vm.selectedTab = [];
            vm.collapse = true;
            vm.queries = vm.groups[query].category_search_queries;
            colourOver(query);
        }
        function colourOver(query){
            var rand = new Date().getTime() % 6;
            vm.selectedTab[query] = "b-b b-b-";
            switch (rand) {
                case 0:
                    rand = "primary";

                    break;
                case 1:
                    rand = "info";
                    break;
                case 2:
                    rand = "warning";
                    break;
                case 3:
                    rand = "accent";
                    break;
                case 4:
                    rand = "success";
                    break;
                case 5:
                    rand = "danger";
                    break;
                default:
                    rand = "light";
            }
            //vm.textColour+=rand;
            vm.selectedTab[query]+=rand;
        }
        function colourLeave(query){
            if(!vm.collapse){
            vm.selectedTab[0]='';
            }
        }
        function isOpen() {
            const el = document.getElementById('collapse');
            if (vm.collapse) {
                $(el).collapse('show');
            }
            else {
                $(el).collapse('hide');
            }
        }
        function collapseNext($event) {
            angular.element($event.currentTarget).next().collapse('toggle');
        }
        function createGroup() {
            var newGroup = {
                category_search_queries: [],
                description: "Something",
                enable_category_search: true,
                group_level: "LEVEL_1",
                label: "New",
                rank: 0
            }
            editGroup(newGroup);

        }
        function editGroup(group) {
            vm.ev = angular.copy(group);
            vm.image = false;
            $mdDialog.show({
                controller: function () {
                    return vm;
                },
                controllerAs: 'vm',
                templateUrl: 'GroupDialog.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: vm.ev,
                clickOutsideToClose: true,
                local: { ev: vm.ev }
            })
            .then(function (answer) {
                if (answer) {
                    if (vm.ev.id) {
                        if (vm.ev.category_search_group_id) {
                            Categories.updateCategorySearchQuery(vm.ev.id, vm.ev).then(function (res) {
                                Object.keys(res).forEach(function(x){
                                    Object.keys(group).forEach(function(y){
                                        if(x==y&&res[x]!==null){
                                            group[y]=res[x];
                                        }
                                    })
                                })
                                UINotification.success("Query Updated");                                
                            }).catch(function (err) {
                                UINotification.error(err.data.message);
                            })
                        } else {
                            Categories.updateCategorySearchGroup(vm.ev.id, vm.ev).then(function (res) {
                                Object.keys(res).forEach(function(x){
                                    Object.keys(group).forEach(function(y){
                                        if(x==y&&res[x]!==null){
                                            group[y]=res[x];
                                        }
                                    })
                                }) 
                                UINotification.success("Group Updated");                                
                            }).catch(function (err) {
                                UINotification.error(err.data.message);
                            })
                        }
                    }
                    else {
                        if (vm.ev.category_search_group_id) {

                            Categories.createCategorySearchQuery(vm.ev, vm.image).then(function (res) {
                                vm.selectedGroup.category_search_queries.push(res);
                                UINotification.success("Query Created");                                
                            }).catch(function (err) {
                                UINotification.error(err.data.message);
                            })
                        } else {
                            Categories.createCategorySearchGroup(vm.ev).then(function (res) {
                                vm.groups.push(res);
                                UINotification.success("Group Created");                                
                            }).catch(function (err) {
                                UINotification.error(err.data.message);
                            })
                        }
                    }
                }
                }, function () {

                }
            );
        }
        function answer(answer) {
            // if (document.getElementById('image_file')) {
            //     vm.image = document.getElementById('image_file').files[0];
            // }
            $mdDialog.hide(answer);
        }
        function createCategory(group) {
            vm.selectedGroup = group;
            var newCategory = {
                category_search_group_id: group.id,
                criteria_search: { categories: [], tags: [], keywords: [] },
                label: "New Category",
                rank: 0
            }
            editGroup(newCategory);

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
        function categoryTitle(id) {
            var title='Loading...';
            vm.categoryList.map(function (x) {
                if (id === x.id) {
                    title = x.title;
                }
            })
            return title;
        }
        function updateImage(ev) {

            Categories.updateCategorySearchQueryImage(vm.image, ev.id).then(function (res) {
                ev = res;
                UINotification.success("Image will be updated soon");                                
                
            }).catch(function (err) {
                UINotification.error(err.data.message);
            })
        }
        function loadImage(){
            vm.image = document.getElementById('image_file').files[0];
            var output = document.getElementById('output');
            output.src = URL.createObjectURL(vm.image);
            getCategory();
        }
        function deleteQuery(query,group){

            var confirm = $mdDialog.confirm()
            .title('Would you like to delete this query?')
            .textContent(query.label)
            .ariaLabel('Delete query')
            .targetEvent(query)
            .ok('YES')
            .cancel('NO');
          $mdDialog.show(confirm).then(function() {
            Categories.deleteCategorySearchQuery(query.id).then(function(res){
            UINotification.success("Query has been deleted"); 
            group.category_search_queries.splice(group.category_search_queries.indexOf(query),1);
                }).catch(function (err){
                    UINotification.error(err.data.message);                
                })
          }, function() {
            UINotification.success("You didn't delete this query");
          });
        }
    }]);