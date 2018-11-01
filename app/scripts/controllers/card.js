app.controller('cardCtrl', ['Cards', 'Profile', 'UINotification', 'CardVariation', '$mdDialog', '$timeout', '$state', '$stateParams', '$scope', '$http','Utils',
    function (Cards, Profile, UINotification, CardVariation, $mdDialog, $timeout, $state, $stateParams, $scope, $http, Utils) {
        var vm = this;
        vm.loading = true;

        vm.cardId = $stateParams.cardId;
        vm.selected = selected;
        vm.setNextPage=setNextPage;
        vm.getNextPage=getNextPage;
        vm.setPreviousPage=setPreviousPage;
        vm.getPreviousPage=getPreviousPage;
        vm.addTag = addTag;
        vm.removeTag = removeTag;
        vm.addCategory = addCategory;
        vm.removeCategory = removeCategory;
        vm.addFormat = addFormat;
        vm.removeFormat = removeFormat;
        vm.cardSales = cardSales;
        vm.approveCard = approveCard;
        vm.setCardOnCatalog = setCardOnCatalog;
        vm.isPublicApprovable = isPublicApprovable;
        vm.isPrivateApprovable = isPrivateApprovable;
        vm.isApprovableToCatalog = isApprovableToCatalog;
        vm.isRejectable = isRejectable;
        vm.isRejectableFromCatalog = isRejectableFromCatalog;
        vm.isReportable = isReportable;
        vm.isEditable = isEditable;
        vm.rejectCard = rejectCard;
        vm.reportCard = reportCard;
        vm.getPrinterVersion = getPrinterVersion;
        vm.saveTags = saveTags;
        vm.saveFormats = saveFormats;
        vm.saveCategories = saveCategories;
        vm.changeColor =changeColor;
        vm.replaceCard = replaceCard;
        vm.rate = rate;
        vm.marketingTemplate = marketingTemplate;
        vm.loadImage = loadImage;
        vm.updateImage = updateImage;

        vm.card = {};
        vm.sale = false;
        vm.sales = [];
        vm.selectedTags = [];
        vm.selectedCategories = [];
        vm.selectedFormats = [];
        vm.selectedCategoryId = [];
        vm.categoryList = {};
        vm.creator = {};
        vm.input = "";
        vm.actionButtons = ["Approve (PUBLIC)", "Approve (PRIVATE)", "Add to catalog", "Reject", "Remove from catalog", "Report"];
        vm.tagList = [];
        $http.get('scripts/controllers/recommendedTags.json').then(function (data) {
            vm.tagList = data.data;
            console.log(data.data)
        });
        var current = Cards.getNext();
        var next = angular.copy(current);
        var previous = angular.copy(current);
        getCard();
        getNextPage();
        getPreviousPage();
        Cards.setNext(null);
        getCategory();
        getFormats();
        cardSales();


        function getCard() {
            Cards.get(vm.cardId).then(function (res) {

                vm.card = res;
                res.classification.tags.map(function (x) {
                    if(vm.selectedTags.indexOf(x)<0)vm.selectedTags.push(x);
                });
                res.classification.category_names.map(function (x) {
                    if(vm.selectedCategories.indexOf(x)<0)vm.selectedCategories.push(x)
                });
                res.classification.categories.map(function (x) {
                    if(vm.selectedCategoryId.indexOf(x)<0)vm.selectedCategoryId.push(x)
                });
                res.creator_formats.map(function (x) {
                    if(vm.selectedFormats.indexOf(x)<0)vm.selectedFormats.push(x);
                });
                getCreator();
                getModerator();
                compareSecondaryImage();
                vm.loading = false;
            })
        }
        function getCategory() {
            Cards.getCategories().then(function (res) {
                console.log(res);
                vm.categoryList = res;
            })
        }
        function getFormats(){
            CardVariation.getSettings().then(function (res) {
                vm.formatList = res.printer_format;
            })
        }
        function getCategory() {
            Cards.getCategories().then(function (res) {
                console.log(res);
                vm.categoryList = res;
            })
        }
        function getCreator() {
            Profile.get(vm.card.creator.id).then(function (res) {
                vm.creator = res;
            })
        }
        function getModerator() {
            if(vm.card.moderation.moderator_id){
                Profile.get(vm.card.moderation.moderator_id).then(function (res) {
                    vm.moderator = res;
                })
            }
        }
        function selected(query, type) {
            if (type === 'tag') {
                tagsLowercase = [];
                vm.card.classification.tags.map(function(x){
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
                if (vm.card.classification.category_names.includes(query) && vm.selectedCategories.includes(query)) {
                    return 'btn-info'
                }
                else if (vm.selectedCategories.includes(query)) {
                    return 'btn-accent'
                }

            } 
            else if (type === 'format') {
                if (vm.card.creator_formats.indexOf(query)>=0 && vm.selectedFormats.indexOf(query)>=0) {
                    return 'btn-info'
                }
                else if (vm.selectedFormats.indexOf(query)>=0) {
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
                vm.selectedTags.push(query)
            }
        }
        function removeTag(query) {
            vm.selectedTags.splice(vm.selectedTags.indexOf(query), 1)
        }
        function addFormat(query) {
           
            if (vm.selectedFormats.indexOf(query)>=0) {
                UINotification.error("this format already exists")
            }
            else if (query) {
                vm.selectedFormats.push(query)
            }
        }
        function removeFormat(query) {
            vm.selectedFormats.splice(vm.selectedFormats.indexOf(query), 1)
        }
        function addCategory(query, id) {
            if (vm.selectedCategories.includes(query)) {
                UINotification.error("this category already exists")
            }
            else if (query) {
                vm.selectedCategories.push(query)
                vm.selectedCategoryId.push(id)
            }
        }
        function removeCategory(query) {
            var index = vm.selectedCategories.indexOf(query);
            vm.selectedCategories.splice(index, 1)
            vm.selectedCategoryId.splice(index, 1)
        }
        function cardSales() {
            Cards.getCardSales(vm.cardId).then(function (res) {
                res.sales.map(function (x) {
                    vm.sales.push([new Date(x.year, x.month-1, 3).getTime(), x.count]);
                });
                vm.totalSales = res.total;
                vm.sale = true;
            })
        }
        function approveCard() {
            saveTags(true);
            saveFormats(true);
            saveCategories(true);
            Cards.approveCard(vm.card, vm.card.visibility).then(function (res) {
                vm.card = res;
                UINotification.success("Card approved");
            })
        }
        function setCardOnCatalog() {
            saveTags(true);
            saveFormats(true);
            saveCategories(true);
            Cards.cardOnCatalog(vm.card,vm.card.visibility).then(function (res) {
                vm.card = res;
                UINotification.success("Card updated");
            })
        }
        function rejectCard() {

            var confirm = $mdDialog.prompt()
                .title('Reason?')
                .ariaLabel('Delete note')
                .placeholder('Add reason')
                .ok('OK')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function (feedback) {
                saveTags(true);
                saveFormats(true);
                saveCategories(true);
                Cards.reject(vm.card, feedback).then(function (res) {
                    vm.card = res;
                    UINotification.success("Card rejected");

                }).catch(function (err) {
                    UINotification.error("Something went wrong :(");
                })
            }, function () {
                UINotification.success("Request Canceled");
            });

        }
        function reportCard() {

            var confirm = $mdDialog.prompt()
                .title('Reason?')
                .ariaLabel('Delete note')
                .placeholder('Add reason')
                .ok('OK')
                .cancel('Cancel');
            $mdDialog.show(confirm).then(function (feedback) {
                saveTags(true);
                saveFormats(true);
                saveCategories(true);
                Cards.report(vm.card, feedback).then(function (res) {
                    vm.card = res;
                    UINotification.success("Card reported");

                }).catch(function (err) {
                    UINotification.error("Something went wrong :(");
                })
            }, function () {
                UINotification.success("Request Canceled");
            });

        }
        function saveTags(local) {
            if(local){
                vm.card.tags = vm.selectedTags;
            }else{
                saveFormats(true);
                saveCategories(true);
                Cards.saveTags(vm.card, vm.selectedTags, vm.card.visibility).then(function (res) {
                    vm.card = res;
                    console.log(res);
                    UINotification.success("Card Updated");

                }).catch(function (err) {
                    UINotification.error("Something went wrong :(");
                })
            }
        }
        function saveFormats(local) {
            if(local){
                vm.card.creator_formats =  vm.selectedFormats;
            }else{
                saveTags(true);
                saveCategories(true);
                Cards.saveFormats(vm.card, vm.selectedFormats, vm.card.visibility).then(function (res) {
                    vm.card = res;
                    console.log(res);
                    UINotification.success("Card Updated");

                }).catch(function (err) {
                    UINotification.error("Something went wrong :(");
                })
            }
        }
        function saveCategories(local) {
            if(local){
                vm.card.categories = vm.selectedCategoryId;
            }else{
                saveTags(true);
                saveFormats(true);
                Cards.saveCategory(vm.card, vm.selectedCategoryId, vm.card.visibility).then(function (res) {
                    vm.card = res;
                    console.log(res);
                    UINotification.success("Card Updated");
    
                }).catch(function (err) {
                    UINotification.error("Something went wrong :(");
                })
            }
        }
        function isPublicApprovable() {
            return (
                (vm.card.visibility === 'PUBLIC' || vm.card.visibility === 'RETIRED') &&
                vm.card.moderation.status !== 'REPORTED' &&
                vm.card.moderation.status !== 'MODERATED'
            )
        }

        function isPrivateApprovable() {
            return (
                vm.card.visibility === 'PRIVATE' &&
                vm.card.moderation.status !== 'REPORTED' &&
                vm.card.moderation.status !== 'MODERATED'
            )
        }

        function isApprovableToCatalog() {
            return (
                vm.card.visibility === 'PUBLIC' &&
                vm.card.moderation.status !== 'REPORTED'
            )
        }
        function isRejectable() {
            return (
                vm.card.visibility !== 'REJECTED' &&
                vm.card.visibility !== 'RETIRED' &&
                vm.card.moderation.status !== 'REPORTED' &&
                vm.card.moderation.status !== 'MODERATED'
            )
        }
        function isRejectableFromCatalog() {
            return (
                vm.card.visibility === 'THORTFUL' &&
                vm.card.moderation.status !== 'REPORTED'
            )
        }

        function isReportable() {
            return (
                vm.card.visibility !== 'REJECTED' &&
                vm.card.visibility !== 'RETIRED' &&
                vm.card.moderation.status !== 'REPORTED'
            )
        }

        function isEditable() {
            return (
                vm.card.visibility !== 'REJECTED'
            )
        }
        function changeColor(query, type) {
            switch (query) {
                case "THORTFUL":
                case "PUBLIC":
                case "MODERATED":
                case "LISTED":
                    return type + "-success";
                case "REPORTED":
                case "REJECTED":
                case "RETIRED":
                    return type + "-danger";
                default:
                    return type + "-warning";
            }
        }
        function rate(query){
            saveTags(true);
            saveFormats(true);
            saveCategories(true);
            Cards.setRate(vm.card,query,vm.card.visibility).then(function(res){
                vm.card = res;
            UINotification.success("Card Updated");

            }).catch(function (err) {
                UINotification.error("Something went wrong :(");
            })
        }
        
        function getPrinterVersion() {
            Cards.getPrinterVersion(vm.cardId).then(function(res) {
                Utils.urlDownload(res.download_link);
            }).catch(function(err) {
                console.log("Cannot get printer version for card with error ", err);
            });
        }

        function replaceCard(state){
            if(state==="REJECTED"){
                var confirm = $mdDialog.prompt()
                    .title('Reason?')
                    .ariaLabel('Reject replacement')
                    .placeholder('Add reason')
                    .ok('OK')
                    .cancel('Cancel');
                $mdDialog.show(confirm).then(function (reason) {
                    saveTags(true);
                    saveFormats(true);
                    saveCategories(true);
                    Cards.replaceCard(vm.card,state,reason,vm.card.visibility).then(function(res){
                    vm.card = res;
                    UINotification.success("Replacement Rejected");

                }).catch(function (err) {
                    UINotification.error("Something went wrong :(");
                })
                }, function () {
                    UINotification.success("Request Canceled");
                });
            }
            else{
                var reason = null;
                Cards.replaceCard(vm.card,state,reason,vm.card.visibility).then(function(res){
                    vm.card = res;
                    UINotification.success("Replacement Approved");

                }).catch(function (err) {
                    UINotification.error("Something went wrong :(");
                })
            }
        }
        function setNextPage(){
            Cards.setNext(next);
        }
        function setPreviousPage(){
            Cards.setNext(previous);

        }
        function getNextPage(){
            vm.nextReady=false;
            if(next&&next.from==='cardList'){
                Cards.getList(next.filter,next.filter2,next.filter3,next.page).then(function(res){
                    setNextCard(res);
                })
            }
            else if(next&&next.from==='creator'){
                Profile.getCards(next.creator,next.page).then(function(res){
                    setNextCard(res);
                })
            }
        }
        function getPreviousPage(){
            vm.previousReady=false;
            if(previous&&previous.from==='cardList'){
                Cards.getList(previous.filter,previous.filter2,previous.filter3,previous.page).then(function(res){
                    setPreviousCard(res);
                })
            }
            else if(previous&&previous.from==='creator'){
                Profile.getCards(previous.creator,previous.page).then(function(res){
                    setPreviousCard(res);
                })
            }
        }
        function setNextCard(res){
            var nextCard = res;
            var row;
            //check if this card is in this table
            nextCard.cards.map(function(x,index){
                if(x.id===next.id){
                    //if it is go to the next card
                    row=index+1
                }
            });
            //if you dont find this card in this table
            if(!row){
                //set as the next  card the same possession
                row=next.row;
            }
            //if there is not card on the next possession and there are more pages
            if(!nextCard.cards[row]&&next.page<nextCard.total_pages-1){
                //change page and get the first card

                next.page = next.page+1;
                next.row=0;
                getNextPage();
            }//if you don't find the card and there is not any pages left
            else if(!nextCard.cards[row]&&next.page>=nextCard.total_pages-1){
                //set next to null adn deactivate the button
                next = null;
                // if everithing is ok set the next cards id and possession with the newone
            }else{
                
                next.id=nextCard.cards[row].id;
                vm.nextId = next.id;
                next.row=row;
                vm.nextReady = true;
                
            }
        }
        function setPreviousCard(res){
            var previousCard = res;
            var row;
            //check if this card is in this table
            previousCard.cards.map(function(x,index){
                if(x.id===previous.id){
                    //if it is go to the previous card
                    row=index-1;
                }
            });
            //if you dont find this card in this table
            if(!row&&row!=0){
                //set as the previous  card the same possession
                row=previous.row;
            }
            //if there is not card on the previous possession and there are more pages
            if(!previousCard.cards[row]&&previous.page>0){
                //change page and get the first card
                previous.page =previous.page-1;
                previous.row=previousCard.cards.length-1;
                getPreviousPage();
            }//if you don't find the card and there is not any pages left
            else if(!previousCard.cards[row]&&previous.page<=0){
                //set previous to null adn deactivate the button
                previous = null;
                // if everithing is ok set the previous cards id and possession with the newone
            }else{

                previous.id=previousCard.cards[row].id;
                vm.previousId = previous.id;
                previous.row=row;
                vm.previousReady = true;
                
            }
        }
        function marketingTemplate(){
            Cards.triggerMarketing(vm.cardId).then(function(res){
                UINotification.success("Card Updated");
            }).catch(function (err) {
                UINotification.error("Something went wrong :(");
            })
        }
        function loadImage(id){
            vm.singleImage.card_variation_id = vm.variationId;
            var image = document.getElementById(id).files[0];
                var _URL = window.URL || window.webkitURL;
                img = new Image();
                var imgwidth = 0;
                var imgheight = 0;
                var minwidth = vm.card.masks[0].width;
                var minheight = vm.card.masks[0].height;
              
                img.src = _URL.createObjectURL(image);
                img.onload = function() {
                 imgwidth = this.width;
                 imgheight = this.height;
                 if(imgwidth >= minwidth && imgheight >= minheight){
                     vm.errorMessage = '';
                     Cards.secondaryImage(vm.cardId,image).then(function(res){
                        UINotification.success("Uploading Image ....");
                        $timeout(function(){
                            vm.previousImage = (vm.card.secondary_image&&vm.card.secondary_image.large)?vm.card.secondary_image.large:'new';
                            getCard()},2000);
                     }).catch(function(err){
                        UINotification.error(err.data.message);                
                     })
                }else{
                    UINotification.error("Image size must be at least "+minwidth+" X "+minheight);
                    vm.errorMessage = "Image size must be at least "+minwidth+" X "+minheight;
                }
               };
        }
        function compareSecondaryImage(){
            if(vm.previousImage){
                if(vm.card.secondary_image&&vm.card.secondary_image.large&&vm.card.secondary_image.large!=vm.previousImage){
                    UINotification.success("Secondary Image is Created!");
                }
            }
        }
        function updateImage(){
            vm.singleImage = {};
            vm.singleImage.asset_id = {};
            document.getElementById('singleImage').click();
        }
    }
]);