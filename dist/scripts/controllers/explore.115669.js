app.controller('exploreCtrl', ['Explore','Utils','Categories','$stateParams','UINotification', '$http', '$mdDialog', '$scope','$state',
                    function(Explore,Utils,Categories,$stateParams,UINotification,$http,$mdDialog,$scope,$state) {
    var vm = this;
    var id = $stateParams.id;
    var card = {
        selected : -1,
        down:false,
        change:false,
    }
    vm.ready = false;
    vm.cardList = [];
    vm.selectedTags = [];
    vm.selectedCategories = [];
    vm.categoryList = [];
    vm.selectedKeywords = [];

    vm.cardSearch = cardSearch;
    vm.addCards = addCards;
    vm.saveIndex = saveIndex;
    vm.selectedCard = selectedCard;
    vm.addTag = addTag;
    vm.removeTag = removeTag;
    vm.addCategory = addCategory;
    vm.removeCategory = removeCategory;
    vm.addKeyword = addKeyword;
    vm.removeKeyword = removeKeyword;
    vm.selected = selected;
    vm.categoryName = categoryName;
    vm.deleteDialog = deleteDialog;
    vm.deleteIndex = deleteIndex;
    vm.deleteCard = deleteCard;
    vm.closeDialog = closeDialog;
    vm.saveRank = saveRank;
    getCategory();
    if(id){
        vm.single = true;
        if(id!='new'){
            Explore.getIndexById(id).then(function(res){
                getIndex(res);
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }else{
            var newIndex = {
                "criteria":{
                    "categories":[],
                    "tags":[],
                    "keywords":[],
                    },
                }
                getIndex(newIndex);
        }
        $http.get('scripts/controllers/recommendedTags.json').then(function (data) {
            vm.tagList = data.data;
        });
    }else{
        getAll();
    }
    function getCategory() {
        Categories.getCategories().then(function (res) {
            console.log(res);
            vm.categoryList = res;
        })
    }
    function getIndex(res){
        vm.index = res;
        vm.ready = true;
        if(vm.index.id){
            Explore.getCardRankByIndexId(null,vm.index.hash).then(function(res){
                var cardIds = [];
                vm.cardList = res;
                res.map(function(x){
                    cardIds.push(x.card_id);
                })
                if(cardIds.length){
                    Explore.getCard(cardIds.toString()).then(function(cards){
                        for(i=0;i<cards.length;i++){
                            vm.cardList[i].card = cards[i];
                        }
                    }).catch(function(err){
                        UINotification.error(err.data.message);
                    })
                }
            }).catch(function(err){
                
                UINotification.error(err.data.message);
            })
        }
        vm.index.criteria.tags.map(function (x) {
            if(vm.selectedTags.indexOf(x)<0)vm.selectedTags.push(x);
        });
        vm.index.criteria.categories.map(function (x) {
            if(vm.selectedCategories.indexOf(x)<0)vm.selectedCategories.push(x);
        });
        vm.index.criteria.keywords.map(function (x,i) {
            if(vm.selectedKeywords.indexOf(x.toLowerCase())<0)vm.selectedKeywords.push(x.toLowerCase());
            vm.index.criteria.keywords[i]=x.toLowerCase();
        })
    }
    function cardSearch(card){
        Explore.getCard(card).then(function(res){
            vm.newCardList=res;
        }).catch(function(err){
            UINotification.error(err.data.message);
        })
    }
    function addCards(index){
        if(index){
            var exist = false;
            vm.cardList.map(function(x){
                if(x.card.id==vm.newCardList[index].id){
                    exist = true;
                }
            })
            if(!exist){
                createQueryCard(index);
            }
            
        }else{
            vm.newCardList.map(function(x,index){
                var exist = false;
                vm.cardList.map(function(y){
                    if(x.id==y.card.id){
                        exist = true;
                    }
                })
                if(!exist){
                createQueryCard(index);
                }
            })
        }
    }
    function createQueryCard(index){
        var data ={ 
            "index_query_hash":vm.index.hash,
            "index_query_id":vm.index.id,
            "card_id":vm.newCardList[index].id,
            "rank":vm.cardList.length
            };
        var card = vm.newCardList[index];
        Explore.createQueryCard(data).then(function(res){
            res.card = card;
            vm.cardList.push(res);
            vm.newCardList.splice(index, 1);
        }).catch(function(err){
            UINotification.error(err.data.message);
        })
    }
    function selectedCard(index,down,list){
        if(down===true){
            card.selected = index;
            card.down = true;
        }
        if(down=== 'over'&&card.down){
            if(index!=card.selected){
                var item = list[card.selected];
                if(card.selected<index){
                    index+=1;
                }
                list.splice(card.selected,1);
                list.splice(index,0,item);
                card.selected = index<list.length?index:list.length-1;
            }
        }
        if(!down){
            card.down = false;
        }
    }
    function selected(query, type) {
        if (type === 'tag') {
            tagsLowercase = [];
            vm.index.criteria.tags.map(function(x){
                tagsLowercase.push(x.toLowerCase());
            })
            selectedLowercase = [];
            vm.selectedTags.map(function(x){
                selectedLowercase.push(x.toLowerCase());
            })
            if (tagsLowercase.includes(query.toLowerCase()) && selectedLowercase.includes(query.toLowerCase())) {
                return 'btn-info'
            }
            else if (selectedLowercase.includes(query.toLowerCase())) {
                return 'btn-accent'
            }
        }
        else if (type === 'category') {
            if (vm.index.criteria.categories.includes(query) && vm.selectedCategories.includes(query)) {
                return 'btn-info'
            }
            else if (vm.selectedCategories.includes(query)) {
                return 'btn-accent'
            }

        } 
        else if (type === 'keyword') {
            if (vm.index.criteria.keywords.indexOf(query.toLowerCase())>=0 && vm.selectedKeywords.indexOf(query.toLowerCase())>=0) {
                return 'btn-info'
            }
            else if (vm.selectedKeywords.indexOf(query.toLowerCase())>=0) {
                return 'btn-accent'
            }
        } else {
            return 'btn-default';
        }
    }
    function addTag(query) {
        vm.input = "";
        selectedLowercase = [];
        vm.selectedTags.map(function(x){
            selectedLowercase.push(x.toLowerCase());
        })
        if (selectedLowercase.includes(query.toLowerCase())) {
            UINotification.error("this tag already exists")
        }
        else if (query) {
            vm.selectedTags.push(query);
        }
    }
    function removeTag(query) {
        vm.selectedTags.splice(vm.selectedTags.indexOf(query), 1)
    }
    function addKeyword(query) {
       
        if (vm.selectedKeywords.indexOf(query.toLowerCase())>=0) {
            UINotification.error("this keyword already exists");
        }
        else if (query) {
            vm.selectedKeywords.push(query.toLowerCase());
        }
    }
    function removeKeyword(query) {
        vm.selectedKeywords.splice(vm.selectedKeywords.indexOf(query.toLowerCase()), 1)
    }
    function addCategory(query) {
        if (vm.selectedCategories.includes(query)) {
            UINotification.error("this category already exists")
        }
        else if (query) {
            vm.selectedCategories.push(query);
        }
    }
    function categoryName(id){
        for(var i=0;i<vm.categoryList.length;i++){
            if(vm.categoryList[i].id==id){
                return vm.categoryList[i].title;
            }
        }
        return id;
    }
    function removeCategory(query) {
        var index = vm.selectedCategories.indexOf(query);
        vm.selectedCategories.splice(index, 1)
    }

    function getAll(){
        Explore.getAllIndex().then(function(res){
            vm.indexList = res;
            vm.ready = true;
        }).catch(function(err){
            UINotification.error(err.data.message);            
        })
    }
    function saveIndex(index){
        vm.index.criteria.card_ids = [];
        // if(vm.cardList.length){
        //     vm.cardList.map(function(x){
        //         vm.index.criteria.card_ids.push(x.id);
        //     })
        // }
        vm.index.criteria.tags = vm.selectedTags;
        vm.index.criteria.categories = vm.selectedCategories;
        vm.index.criteria.keywords = vm.selectedKeywords;

        if(index.id){
            Explore.updateIndex(index,index.id).then(function(res){
                UINotification.success("Index Saved");
                getIndex(res);
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }else{
            Explore.createIndex(index,index.id).then(function(res){
                UINotification.success("Index Created");
                $state.go('explore.index',{id: res.id});
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
    }
    function deleteDialog(index,type){
        vm.selectedIndex = index;
        $mdDialog.show({
            template:
                '<md-dialog aria-label="Delete">' +
                    '<div layout-padding layout="column">' +
                        '<md-title class="h3">Delete '+(type=='card'?'Card':'Index')+'?</md-title>' +
                        '<p class="text-right">' +
                        (type=='card'?
                            '<button ng-click="vm.deleteCard(vm.selectedIndex)" class="btn btn-primary">Yes</button>  ' 
                        :
                            '<button ng-click="vm.deleteIndex(vm.selectedIndex)" class="btn btn-primary">Yes</button>  '
                        ) +
                            '<button ng-click="vm.closeDialog()" class="btn btn-default">No</button>' +
                        '</p>' +
                    '</div>'+
                '</md-dialog>',
            scope: $scope,
            preserveScope: true,
        })
    }
    function closeDialog(){
        $mdDialog.cancel();
    }
    function deleteIndex(index){
        Explore.deleteIndex(index.id).then(function(res){
            UINotification.success("Index Deleted");
            closeDialog();
            $state.go('explore.index',{id: null});
        }).catch(function(err){
            UINotification.error(err.data.message);
        })
    }
    function deleteCard(index){
        Explore.deleteQueryCard(index.id).then(function(res){
            UINotification.success("Card Removed");
            closeDialog();
            for(i=0;i<vm.cardList.length;i++){
                if(vm.cardList[i].id==index.id){
                    vm.cardList.splice(i,1);
                    return;
                }
            }
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
    }
    function saveRank(card,rank){
        card.rank = rank;
        Explore.updateQueryCard(card,card.id).then(function(res){
            UINotification.success("Card Updated");

        }).catch(function(err){
            UINotification.error(err.data.message);
        })
    }
        // Explore.getCardRanById().then(function(res){

        // }).catch(function(err){
        //     UINotification.error(err.data.message);
        // })
        
}]);