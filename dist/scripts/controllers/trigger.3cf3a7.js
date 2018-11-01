app.controller('triggerCtrl', ['Discount', 'Profile', 'Cards', 'Order', 'Triggers', 'UINotification','Utils','$timeout','$mdDialog', '$state', '$stateParams', '$scope',
    function (Discount, Profile, Cards, Order, Triggers, UINotification, Utils, $timeout, $mdDialog, $state, $stateParams, $scope) {
        var vm = this;
        vm.searchProfile = searchProfile;
        vm.searchOrder = searchOrder;
        vm.searchCards = searchCards;
        vm.addItem = addItem;
        vm.removeItem = removeItem;

        vm.countOrder = countOrder;
        vm.countAllOrders = countAllOrders;
        vm.countCard = countCard;
        vm.countAllCards = countAllCards;
        vm.countRankCards = countRankCards;
        vm.countProfile = countProfile;
        vm.countAllProfiles = countAllProfiles;
        vm.countAllProfilesPlusRecent = countAllProfilesPlusRecent;
        vm.cardReports = cardReports;
        vm.sessionReports = sessionReports;
        vm.newSessionTask = newSessionTask;
        vm.taskProgress = taskProgress;
        vm.mailChimpPushAll = mailChimpPushAll;
        vm.mailChimpPullAll = mailChimpPullAll;
        vm.mailChimpUpdateProfile = mailChimpUpdateProfile;
        vm.triggerEmails = triggerEmails;
        vm.triggerSelectedEmails = triggerSelectedEmails;
        vm.refreshExplore = refreshExplore;
        vm.profile = profile;
        vm.getCampaign = getCampaign;
        vm.countCampaign = countCampaign;
        vm.id='';

        vm.selectedProfiles = [];
        vm.selectedProfiles2 = [];
        vm.selectedProfiles3 = [];
        vm.selectedCampaign = [];
        vm.selectedOrders = [];
        vm.selectedCards = [];
        vm.buyerList = [];
        vm.taskList = [];
        vm.emailList = [];
        vm.emailList2 = [];
        vm.emailtypeList =["ORDER", "PROFILE", "BASKET"];
        vm.emailtype=vm.emailtypeList[0];
        vm.statusList =["NONE", "NEEDS_TO_SEND", "SENT", "ERROR"];
        vm.status=vm.statusList[0];

        vm.text={};
        vm.lock = true;
        function searchProfile(text) {
            vm.profileList = [];
            if (text.length>1) {
                    return Profile.search(text).then(function (res) {
                        vm.profileList = res.profiles;
                            return vm.profileList;
                    }).catch(function (err) {
                        return vm.profileList;
                    });
            }
            else {
                return vm.profileList;
            }
        }
        function refreshExplore(){
            Triggers.refreshExplore().then(function(res){
                UINotification.success("Explore Refresh Completed");
            }).catch(function(err){
                UINotification.error(err.data.message);

            })
        }
        function profile(value){
            if(value){
              for(var i in vm.buyerList)
              {
                if(value===vm.buyerList[i].id)
                {
                  if(vm.buyerList[i].contact.firstname){
                  return vm.buyerList[i].contact.firstname + " "+ vm.buyerList[i].contact.surname;
                  }else{
                    return "Private Name"
                  }
                }
              }if(vm.lock){
                vm.lock=false;
                Profile.get(value).then(function(res){
                  vm.buyerList.push(res);
                  vm.lock=true;
                  if(res.contact){
                    return res.contact.firstname + " "+ res.contact.surname;
                  }else{
                    return "Private Name"
                  }
                })
              }
            }
          }
        function searchOrder(text) {
            vm.orderList = [];
            if (text.length>22) {
                    return Order.get(text).then(function (res) {
                        vm.orderList.push(res);
                            return vm.orderList;
                    }).catch(function (err) {
                        return vm.orderList;
                    });
            }
            else {
                return vm.orderList;
            }
        }
        function searchCards(text) {
            vm.CardList = [];
            if (text.length>22) {
                    return Cards.get(text).then(function (res) {
                        vm.CardList.push(res);
                            return vm.CardList;
                    }).catch(function (err) {
                        return vm.CardList;
                    });
            }
            else {
                return vm.CardList;
            }
        }
        function addItem(item,place){
            var newItem = true;
            if(item){
                place.map(function(x){
                    if(x.id==item.id){
                        newItem = false;
                    }
                })
                if(newItem){
                    place.push(item);
                }
                    vm.text={};
            }
        }
        function removeItem(item,place){
            place.splice(place.indexOf(item), 1);
        }
        function getCampaign(campaign) {
            vm.campaign = [];
                    Discount.getCampaign(campaign).then(function (res) {
                        vm.campaign = res;
                }).catch(function (err) {
                    UINotification.error(err.data.message);
                });
        }
        function countCampaign(campaigns){
            campaigns.map(function(x){
                Triggers.countCampaign(x.id).then(function(res){
                    res = res['counting-result'] ||res;
                    UINotification.success(res);
                }).catch(function(err){
                    UINotification.error(err.data.message);
                })
            })
        }
        function countOrder(){
            vm.selectedOrders.map(function(x){
                Triggers.countOrder(x.id).then(function(res){
                    UINotification.success(res);
                }).catch(function(err){
                    UINotification.error(err.data.message);
                })

            })

        }
        function countAllOrders(){
            Triggers.countAllOrders().then(function(res){
                UINotification.success("Done");
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function countCard(){
            vm.selectedCards.map(function(x){
                Triggers.countCard(x.id).then(function(res){
                    UINotification.success("Done");
                }).catch(function(err){
                    UINotification.error(err.data.message);
                })
            })
        }
        function countAllCards(){
            Triggers.countAllCards().then(function(res){
                UINotification.success(res["card-repair-result"]?res["card-repair-result"]:"Done");
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function countRankCards(){
            Triggers.countRankCards().then(function(res){
                UINotification.success("Done");
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function countProfile(){
            vm.selectedProfiles2.map(function(x){
                Triggers.countProfile(x.id).then(function(res){
                    UINotification.success("Done");
                }).catch(function(err){
                    UINotification.error(err.data.message);
                })
            })
        }
        function countAllProfiles(){
            Triggers.countAllProfiles().then(function(res){
                UINotification.success(res["profile-repair-result"]?res["profile-repair-result"]:"Done");
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function countAllProfilesPlusRecent(){
            Triggers.countAllProfilesPlusRecent().then(function(res){
                UINotification.success(res["counting-result"]?res["counting-result"]:"Done");
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function cardReports(){
            Triggers.cardReports().then(function(res){
                UINotification.success("Done");
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function sessionReports(){
            Triggers.sessionReports().then(function(res){
                UINotification.success("Done");
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function newSessionTask(){
            Triggers.newSessionTask().then(function(res){
                UINotification.success(res);
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function taskProgress(){
            Triggers.taskProgress().then(function(res){
                vm.taskList = res;
                UINotification.success("Done");
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function mailChimpPushAll(){
            Triggers.mailChimpPushAll().then(function(res){
                UINotification.success("Done");
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function mailChimpPullAll(){
            Triggers.mailChimpPullAll().then(function(res){
                UINotification.success("Done");
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function mailChimpUpdateProfile(){
            vm.selectedProfiles.map(function(x){
                Triggers.mailChimpUpdateProfile(x.id).then(function(res){
                    UINotification.success("Done");
                }).catch(function(err){
                    UINotification.error(err.data.message);
                })
            })
        }
        function triggerEmails(){
            Triggers.triggerEmails(vm.emailtype).then(function(res){
                vm.emailList = res;
                UINotification.success("Done");
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function triggerSelectedEmails(){
            Triggers.triggerSelectedEmails(vm.status,id).then(function(res){
                vm.emailList2= res;
                UINotification.success("Done");
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
                
        }
    }]);    