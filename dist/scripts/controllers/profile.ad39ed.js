app.controller('profileCtrl', ['Order', 'Profile','Payment','Cards','UINotification','Email','$mdDialog','$scope','$state','$stateParams', 
                    function(Order, Profile, Payment, Cards, UINotification, Email, $mdDialog, $scope, $state, $stateParams) {


    vm = this;
    vm.profileId = $stateParams.profileId;
    vm.date = new Date();

    vm.editTier = editTier;
    vm.addCredits = addCredits;
    vm.sendCredits = sendCredits;
    vm.saveTier = saveTier;
    vm.getNotes = getNotes;
    vm.addNote = addNote;
    vm.getBasket = getBasket;
    vm.creatorsNickname = creatorsNickname;
    vm.creatorsPicture = creatorsPicture;
    vm.deleteNote = deleteNote;
    vm.loadProfileOrders = loadProfileOrders;
    vm.loadProfileCards = loadProfileCards;
    vm.enableEditor = enableEditor;
    vm.disableEditor = disableEditor;
    vm.saveEmail = saveEmail;
    vm.vatApprove = vatApprove;
    vm.vatClose = vatClose;
    vm.disableProfile = disableProfile;
    vm.missing = missing;
    vm.nextCard = nextCard;
    vm.vatDate = vatDate;
    vm.featured = featured;
    vm.status = status;
    vm.showVat = showVat;
    vm.saveInfo = saveInfo;
    vm.editInfo = editInfo;
    vm.disableInfoEditor = disableInfoEditor;
    vm.getPaymentMethod = getPaymentMethod;
    vm.deletePaymentMethod = deletePaymentMethod;
    vm.collapse = collapse;
    vm.setRoyalties = setRoyalties;
    vm.editRoyalties = editRoyalties;
    vm.closeDialog = closeDialog;
    vm.pay = pay;
    vm.orderStyle = orderStyle;
    vm.payCreator = payCreator;
    vm.checkStatus = checkStatus;
    vm.expiredDate = expiredDate;
    vm.getEmailList = getEmailList;
    vm.collapseNext = collapseNext;
    vm.toTitleCase = toTitleCase;
    vm.resendEmail = resendEmail;
    vm.optionDialog = optionDialog;
    vm.updateEmail = updateEmail;
    vm.gotToAddressList = gotToAddressList;

    vm.refresh =false;
    vm.editTierMode = false;
    vm.editorEnabled = false;
    vm.addCreditsMode = false;
    vm.search = true;
    vm.ready = false;
    vm.cardList = {};
    vm.usersCards = {};
    vm.noteList=[];
    vm.disableButtons = false;

    vm.profile = {};
    vm.salesReport=[];
    vm.creatorList = [];
    vm.basket = {};
    vm.basketCards = [];
    vm.basketQuantity = 0;

    vm.creatorTier= null;
    vm.note='';
    vm.viewableLimit= null;
    vm.totalLimit=null;
    vm.paypalEmail = false;
    vm.credits = 100;
    vm.expDate = new Date(new Date().setDate(vm.date.getDate() + 10));
    vm.reason = '';

    var listStatus =['REFUNDED','UNDELIVERED'];

    vm.orderPage = 0;
    vm.cardPage = 0;
    
    loadProfileInfo();
    loadProfileOrders(0);
    loadProfileCards(0);
    getNotes();
    getBasket();
    function loadProfileInfo() {
      Profile.get(vm.profileId).then(function(res){
        vm.profile = res;
        console.log("Orders are",res);
        vm.creatorTier= vm.profile.creator_tier;
        vm.viewableLimit= vm.profile.cards_viewable_limit;
        vm.totalLimit=vm.profile.cards_combination_limit;
        availableCredits(res.profile_credits.credits);
        getRoyalties(res.royalties_periods);
        // Paypal royalties email
        if (vm.profile.payment_info && vm.profile.payment_info.paypal_account && vm.profile.payment_info.paypal_account.withdrawal_email) {
          vm.paypalEmail = true;
        }
        // Grab a billing address / if not exist Home fill if any
        // 
        if (vm.profile.addresses) {
          for (var i=0; i < vm.profile.addresses.length; i++) {
            var address = vm.profile.addresses[i];
            if (address.address_types && (address.address_types.indexOf("DELIVERY_ADDRESS_HOME_FILL") != -1 ||
                address.address_types.indexOf("BILLING_ADDRESS") != -1)) {
            
              vm.homeAddress = address;
              if (address.address_types.indexOf("BILLING_ADDRESS") != -1) {
                break;
              }
            }
          }
        }
        // get the creator's sales
        if (vm.profile.profile_report) {
          var sales = vm.profile.profile_report.monthly_sales;
          vm.salesReport = [];
          for (var i=0; i < sales.length; i++ ){
            var day = sales[i].year + "/" + sales[i].month + "/15";
            vm.salesReport.push([new Date(day).getTime(),sales[i].count]);
          }
        }
        vm.ready=true;
      }).catch(function(err) {
        console.log("Err",err);
      })
    }

    function loadProfileOrders(page) {
      vm.orderPage = page;
      Order.getAllByProfileId(vm.profileId,page).then(function(res) {
        vm.purchases = res;
        for(var i =0; i<vm.purchases.orders.length;i++){
          if(i==0){
            vm.purchases.orders[i].style = true;
          }
          else if(vm.purchases.orders[i].multi_address_order_id&&vm.purchases.orders[i].multi_address_order_id==vm.purchases.orders[i-1].multi_address_order_id){
            vm.purchases.orders[i].style = vm.purchases.orders[i-1].style;
          }
          else{
            vm.purchases.orders[i].style = !vm.purchases.orders[i-1].style;
          }
        }
      }).catch(function(err){
        UINotification.error(err.data.message);        
      })
    }

    function loadProfileCards(page) {
      vm.cardPage = page;
      Profile.getCards(vm.profileId,page).then(function(res){
        vm.cardList = res;
        console.log("cards are",vm.cardList);
      }).catch(function(err) {
        UINotification.error(err.data.message);
      })
    }

    function editTier() {
      console.log("Editing");
      vm.editTierMode = !vm.editTierMode;
    }   
    function saveTier() {
      Profile.setCardLimit(vm.profileId,vm.viewableLimit,vm.totalLimit)
      .then(function(res) {

        Profile.setTier(vm.profileId,vm.creatorTier)
        .then(function(res) {
          vm.profile.creator_tier = vm.creatorTier;
          vm.profile.cards_viewable_limit = vm.viewableLimit;
          vm.profile.cards_combination_limit =vm.totalLimit;
          UINotification.success("Creator Tier updated");
        
        }).catch(function(err){
          UINotification.error(err.data.message);
        })
      }).catch(function(err){
        vm.creatorTier= vm.profile.creator_tier;
        vm.viewableLimit= vm.profile.cards_viewable_limit;
        vm.totalLimit=vm.profile.cards_combination_limit;
        UINotification.error(err.data.message);
      })
      vm.editTierMode = false;
    }
    function getNotes() {
      Profile.getNotes(vm.profileId).then(function(res){
        vm.noteList=res;
        vm.creatorList=[];
        for(i in vm.noteList){
          Profile.get(vm.noteList[i].user_created_id).then(function(res){
            vm.creatorList.push(res.public_profile);
          })
        }
      }).catch(function(err){
        UINotification.error(err.data.message);        
      })
    }
    function addNote() {
      Profile.addNote(vm.note,vm.profileId).then(function(res){
        vm.noteList.push(res);
          Profile.get(res.user_created_id).then(function(res){
            vm.creatorList.push(res.public_profile);
          })
          UINotification.success("Notes updated");
          vm.note = '';

      }).catch(function(err){
        UINotification.error(err.data.message);        
      })
    }
    function deleteNote(query) {
          for(var i in vm.noteList)
          {
            if(query===vm.noteList[i].id)
            {
        var confirm = $mdDialog.confirm()
          .title('Would you like to delete this note?')
          .textContent(vm.noteList[i].text)
          .ariaLabel('Delete note')
          .targetEvent(query)
          .ok('YES')
          .cancel('NO');
        $mdDialog.show(confirm).then(function() {
          Profile.deleteNote(query,vm.profileId).then(function(res){
            vm.noteList.splice(i,1);
            UINotification.success("Note deleted");

          }).catch(function(err){
            UINotification.error(err.data.message);
        })
        }, function() {
          UINotification.success("You didn't delete this note");
        });
              break;
            }
          }
    }
    function creatorsNickname(value){
      if(value){
        for(i in vm.creatorList)
        {
          if(value===vm.creatorList[i].profile_id)
          {
            if(vm.creatorList[i].nickname){
            return vm.creatorList[i].nickname;
            }else{
              return "Private Name"
            }
          }
        }if(vm.search){
          vm.search=false;
          Profile.get(value).then(function(res){
            vm.creatorList.push(res.public_profile);
            vm.search=true;
            if(res.public_profile.nickname){
              return res.public_profile.nickname;
            }else{
              return "Private Name"
            }
          })
        }
      }
    }
    function creatorsPicture(value){
      for(i in vm.creatorList)
      {
        if(value===vm.creatorList[i].profile_id)
        {
          return vm.creatorList[i].profile_picture.medium;
        }
      }
    }
    function getPaymentMethod(){
      vm.loadingPayment = true;
      Profile.getPaymentMethod(vm.profileId).then(function(res){
        vm.loadingPayment = false;
        vm.paymentMethod = res;
      }).catch(function(err){
        UINotification.error(err.data.message);
      })
    }
    function deletePaymentMethod(method){
      vm.loadingPayment = true;      
      Profile.deletePaymentMethod(method.method_id,vm.profileId).then(function(res){
        UINotification.success("Payment Method Deleted");        
        vm.loadingPayment = false;
        vm.paymentMethod.splice(method,1);
      }).catch(function(err){
        vm.loadingPayment = false;        
        UINotification.error(err.data.message);
      })
    }
    function enableEditor() {
      vm.editorEnabled = true;
      vm.editableTitle = vm.profile.contact.email;
    }
    function disableEditor() {
      vm.editorEnabled = false;
    }
    function saveEmail() {
      if(vm.editableTitle!==vm.profile.contact.email){
        Profile.editEmail(vm.editableTitle,vm.profileId).then(function(res){
          vm.profile.contact.email = vm.editableTitle;
          disableEditor();
          UINotification.success("Email updated");
        }).catch(function(err){
          UINotification.error(err.data.message);
        })
      }
      else{
        UINotification.error("This is the same email");
        disableEditor();
      }
    }
    function addCredits(){
      vm.addCreditsMode=!vm.addCreditsMode;
    }
    function sendCredits(){
      var creditCall = 'addCredits';
      if(vm.credits<0){
        creditCall = 'removeCredits';
      }
      Profile[creditCall](vm.credits,vm.expDate,vm.reason,vm.profileId)
      .then(function(res) {
        vm.profile.profile_credits = res;
        availableCredits(res.credits)
          UINotification.success("Credits Tier updated");
      }).catch(function(err){
        UINotification.error(err.data.message);
      })
      vm.editTierMode = false;
      addCredits();
    }
    function vatApprove(query,id){

      Profile.vatApprove(query,id,vm.profileId).then(function(res){
        vm.profile.vat_certificates=res.vat_certificates;

        if(query){UINotification.success("VAT Approved");}
        else{UINotification.success("VAT rejected");}
      }).catch(function(err){
        UINotification.error(err.data.message);
      })
    }
    function vatClose(date){
      if(date){
        vm.closeDialog();
        Profile.vatClose(vm.profileId,date).then(function(res){
          vm.profile.vat_certificates=res.vat_certificates;
  
          UINotification.success("VAT Closed");
        }).catch(function(err){
          UINotification.error(err.data.message);
        })
      }else{
        vm.fromDate = new Date();
        $mdDialog.show({
          template:
          '<md-dialog>' +
          '<div layout-padding layout="column">' +
          '<md-title class="h3">Please enter the close date</md-title>' +
          '<md-datepicker ng-model="vm.fromDate"></md-datepicker>'+
          '<p class="text-right">' +
          '<button ng-click="vm.vatClose(vm.fromDate)" class="btn btn-primary">Save</button>  ' +
          '<button ng-click="vm.closeDialog()" class="btn btn-default">Cancel</button>' +
          '</p>' +
          '</div>' +
          '</md-dialog>',
          scope: $scope,
          preserveScope: true,
        })
      }
    }
    function disableProfile(){
      vm.disableButtons = true;
      Profile.disableProfile(vm.profile.enabled,vm.profileId).then(function(res){
        vm.profile.enabled = res.enabled;
        vm.disableButtons = false;
        UINotification.success("Profile Updated");
      }).catch(function(err){
        UINotification.error(err.data.message);
      })
    }
    function getBasket(){
      vm.refresh = true;
      vm.basketCards = [];
      Profile.getBasket(vm.profileId).then(function(res){
        vm.basketQuantity =0;
        vm.basket = res;
        for(var i=0; i<vm.basket.basket_items.length;i++){
          vm.refresh=true;
          vm.basketQuantity+=vm.basket.card_order_items[i].quantity;
          Profile.getCard(vm.basket.basket_items[i].cards[0].card_id).then(function(res){
            vm.basketCards.push(res[0]);
            if(vm.basketCards.length===vm.basket.basket_items.length)
            {
              setImg();
              vm.refresh = false;
            }
            console.log("card",res)
          })
        }
        vm.refresh = false;
      })
    }
    function missing(query){
      if(!query)
      {
        return "text-danger";
      }
    }
    function setImg(){
      for(var i=0;i<vm.basket.basket_items.length;i++)
      {
        for(j=0;j<vm.basketCards.length;j++)
        {
          if(vm.basket.basket_items[i].cards[0].card_id===vm.basketCards[j].id)
          {
            vm.basket.basket_items[i].cards[0].image=vm.basketCards[j].image;
          }
        }
      }
    }
    function nextCard(index,row){
      var current ={
        from:'creator',
        creator:vm.profileId,
        page:vm.cardPage,
        id:index,
        row:row
      }
        Cards.setNext(current);
    }
    function vatDate(query){
      if(query){
      return new Date(query.split(' ')[0]);
      }
      else
      {
        return null;
      }
    }
    function featured(){
      Profile.setFeatured(vm.profileId,!vm.profile.featured_creator).then(function(res){
        console.log("featured",res)
        vm.profile.featured_creator = res.featured_creator;
        UINotification.success("Profile Updated");
      }).catch(function(err){
        UINotification.error(err.data.message);
      })
    }
    function status(visibility,status){
      if(status === "AWAITING_REVIEW"){
      return "fa-gavel text-warning";
      }else if(visibility === "RETIRED"){
      return "fa-caret-down text-dark";
      }else if(visibility === "PRIVATE"){
      return "fa-eye text-warning";
      }else if(visibility === "PUBLIC"){
      return "fa-user text-info";
      }else if(visibility === "REJECTED"){
      return "fa-ban text-danger";
      }else if(status === "MODERATED" && visibility === "THORTFUL"){
      return "fa-cloud text-primary";
      }
    }
    function showVat(){
      vm.hideVat=!vm.hideVat;
    }
    function editInfo(){
      vm.editInfoMode = true;
      vm.info = {
        firstname : ''+vm.profile.contact.firstname,
        surname : ''+vm.profile.contact.surname,
        bio : ''+vm.profile.public_profile.bio,

      };
    }
    function disableInfoEditor(){
      vm.editInfoMode = false;
    }
    function availableCredits(credits){
      var available = [];
      var parent = [];
      credits.map(function(x){
        if(x.state==="AVAILABLE"){
          available.push(x);
        }
        else{
          parent.push(x);
        }
      })
      available.map(function(av){
        if(av.source.previous_id){
          var child = av;
          av.parents = [];
          for(var i=0; i<parent.length;i++){
            if(parent[i].id.date === child.source.previous_id.date&&parent[i].id.inc === child.source.previous_id.inc){
              av.parents.push(parent[i]);
              if(parent[i].source.previous_id){
                child = parent[i];
                //parent.splice(i,1);
                i = -1;
              }
              else{
                i = parent.length;
              }

            }
          }
        }
      })
      vm.availableCreditList = available;
      availableGroup =[];
      available.map(function(x){
        if(x.parents){
          var isNew = true;
          availableGroup.map(function(y){
            if(y.top_parent && x.parents[x.parents.length-1].id === y.top_parent.id){
              y.amount+=x.amount;
              y.siblings.push(x);
              isNew = false;
            }
          })
          if(isNew){
            availableGroup.push({
              amount : x.amount,
              expiry : x.expiry,
              source : x.parents[x.parents.length-1].source,
              top_parent :x.parents[x.parents.length-1],
              siblings: [x],
            })
          }
        }
        else{
          availableGroup.push(x)
        }
      })
      vm.availableGroup = availableGroup;
      console.log(availableGroup);
    }
    function collapse($event){
      angular.element($event.currentTarget).next().collapse('toggle');
    }
    function saveInfo(){
      Profile.setProfileInfo(vm.profileId,vm.info).then(function(res){
          vm.profile.contact.firstname = res.contact.firstname;
          vm.profile.contact.surname = res.contact.surname;
          vm.profile.public_profile.bio = res.public_profile.bio;
          vm.editInfoMode = false;
      }).catch(function(err){
          UINotification.error(err.data.message);
        })
    }
    function editRoyalties(){
      vm.editRoyaltiesMode = true;
    }
    function setRoyalties(data){
      Profile.setRoyalties(vm.profileId,data).then(function(res){
        getRoyalties(res.royalties_periods);        
        closeDialog();
        UINotification.success('New Royalty period created');
      }).catch(function(err){
        UINotification.error(err.data.message);
      })
    }
    function getRoyalties(royalties){
      vm.royalties = royalties;
      royalties.map(function(x){
        if(x.active){
          vm.activeRoyalty = x;
        }
        else{

        }
      })
    }
    function editRoyalties() {
      vm.newRoyalty = {
        amount:	0.5,
        new_royalty_start: new Date(),
        message:'',
      };
      $mdDialog.show({
          template:
            '<md-dialog aria-label="Test">' +
              '<div layout-padding layout="column">' +
                '<md-title class="h3">Please enter the refund reasons</md-title>' +
                '<md-input-container>' +
                  '<input mdInput placeholder="Amount" type="number" ng-model="vm.newRoyalty.amount"min="0" step="0.1">' +
                '</md-input-container>' +
                '<md-datepicker md-hide-icons="calendar" ng-model="vm.newRoyalty.new_royalty_start" "md-placeholder="Starting Date"></md-datepicker>' +
                '<md-input-container>' +
                  '<input mdInput placeholder="Message" ng-model="vm.newRoyalty.message">' +
                '</md-input-container>' +
                '<p class="text-right">' +
                  '<button ng-click="vm.setRoyalties(vm.newRoyalty)" class="btn btn-primary">Save</button>  ' +
                  '<button ng-click="vm.closeDialog()" class="btn btn-default">Cancel</button>' +
                '</p>' +
              '</div>' +
            '</md-dialog>',
          scope: $scope,
          preserveScope: true,
      })
  }
  function refundRequest() {
      Order.refund(vm.orderId, vm.stripeReason, vm.thortfulReason).then(function (res) {
          vm.order = res;
          UINotification.success("Refund request sent");
      }).catch(function (err) {
          UINotification.error("Refund request fail");
      })
      vm.closeDialog();
  }
  function closeDialog() {
      $mdDialog.cancel();
  }
  function pay(){
      $mdDialog.show({
          template:
          '   <div class="card-heading"style="min-width: 310px;">'+
          '       <h2>Payment Report</h2>'+
          '   </div>'+
          '   <div class="list-group no-radius no-border">'+
          '       <div class="list-group-item">'+
          '           <span class="pull-right">{{vm.profile.paypal_account.email}}</span> PayPal'+
          '       </div>'+
          '       <div class="list-group-item">'+
          '           <span class="pull-right">£{{(vm.profile.profile_report.unpaid_amount).toFixed(2)}}</span> Total Amount to pay'+
          '       </div>'+
          '       <div class="list-group-item">'+
          '           <span class="pull-right">{{vm.profile.profile_report.unpaid_cards_quantity}}</span> Total Cards to pay'+ 
          '       </div>'+
          '       <div class="list-group-item text-danger" ng-if="vm.profile.profile_report.unpaid_amount<5" ng-init="vm.payment_warning=false">'+
          '           <md-checkbox ng-model="vm.payment_warning" class="md-primary pull-right"style="top:  30px;"></md-checkbox> Warning:<br>This payment\'s value is less than £5.<br>Please confirm before you proceed.'+ 
          '       </div>'+
          '   </div>'+
          '   <div class="card-body text-right">'+
          '       <button ng-click="vm.payCreator()" class="btn btn-primary" ng-disabled="vm.payment_warning===false">Pay Creator</button>  '+
          '       <button ng-click="vm.closeDialog()" class="btn btn-primary">Cancel</button>  '+
          '   </div>',
          scope: $scope,
          preserveScope: true,
          clickOutsideToClose: true,          
          })
  }
  function expiredDate(date){
    if(date){
      return new Date(date).getTime()<new Date().getTime();
    }
  }
  function collapseNext($event) {
    angular.element($event.currentTarget).next().collapse('toggle');
  }
  function getEmailList(){
    vm.emails = {
      sent :{list:[],
        type:{},
        page : 0,
      },
      waiting :{list:[],
        type:{},
        page : 0,
      },
      other :{list:[],
        type:{},
        page : 0,
      },
    };
    Email.getProfileEmails(vm.profileId,'SENT').then(function(res){
      vm.emails.sent.list = res;
      vm.emailType = 'sent';
      res.map(function(x){
        if(vm.emails.sent.type[x.email_type]){
          vm.emails.sent.type[x.email_type]++;
        }else{
          vm.emails.sent.type[x.email_type]=1;
        }
      })
    })
    Email.getProfileEmails(vm.profileId,'NEEDS_TO_SEND').then(function(res){
      vm.emails.waiting.list = res;
      res.map(function(x){
        if(vm.emails.waiting.type[x.email_type]){
          vm.emails.waiting.type[x.email_type]++;
        }else{
          vm.emails.waiting.type[x.email_type]=1;
        }
      })
    })
    Email.getProfileEmails(vm.profileId,'ERROR').then(function(res){
      vm.emails.other.list = res;
      res.map(function(x){
        if(vm.emails.other.type[x.email_type]){
          vm.emails.other.type[x.email_type]++;
        }else{
          vm.emails.other.type[x.email_type]=1;
        }
      })
      Email.getProfileEmails(vm.profileId,'NONE').then(function(res){
        vm.emails.other.list = vm.emails.other.list.concat(res);
        res.map(function(x){
          if(vm.emails.other.type[x.email_type]){
            vm.emails.other.type[x.email_type]++;
          }else{
            vm.emails.other.type[x.email_type]=1;
          }
        })
      })
    })
  }
  function gotToAddressList(email){
    Order.multiAddressOrder(email.parent_order_id).then(function(res){
      if(res.orders.length>1){
        $state.go('users.orders',{customerId:res.human_readable_id},{inherit:false})
      }else{
        $state.go('users.order',{orderId: res.orders[0].id})
      }
    }).catch(function(err){
      UINotification.error(err.data.message);
  })
  }
  function resendEmail(email){
    Order.multiAddressOrder(email.parent_order_id).then(function(res){
      Email.resendEmail(res.orders[0].id,email.email_type).then(function(res){
        UINotification.success("New Email Sent");
      }).catch(function(err){
          UINotification.error(err.data.message);
      })
    }).catch(function(err){
      UINotification.error(err.data.message);
    })
    closeDialog();
  }
  function updateEmail(email,status){
    Email.updateEmailStatus(email.id,status).then(function(res){
      UINotification.success("Email Updated");
    }).catch(function(err){
        UINotification.error(err.data.message);
    })
    closeDialog();
  }
  function optionDialog(mail){
    vm.selectedEmail = mail;
    vm.newStatus = mail.status;
    if(!mail.parent_order_id){
      return false;
    }
    $mdDialog.show({
        template:
            '<md-dialog aria-label="Email">' +
                '<div layout-padding layout="column">' +
                    '<md-title class="h3">Email'+
                    '<button ng-click="vm.gotToAddressList(vm.selectedEmail)" class="btn btn-primary pull-right">Go to Order</button>' +
                    '</md-title>' +
                    '<md-content>' +
                    '<p>Type:' +
                    '<span class="pull-right">'+vm.selectedEmail.email_type+'</span>'+
                    '</p>' +
                    '<p>Status:' +
                    '<span class="pull-right">'+vm.selectedEmail.status+'</span>'+
                    // '</p>' +
                    //   '<md-input-container>'+
                    //     '<label>Type</label>'+
                    //     '<md-select ng-model="vm.newStatus">' +
                    //       '<md-option ng-value="option" ng-repeat="option in [\'NONE\', \'NEEDS_TO_SEND\', \'SENT\', \'ERROR\']">'+
                    //       '{{option}}</md-option>'+
                    //     '</md-select>'+
                    //   '</md-input-container>'+
                    //   '<button ng-click="vm.updateEmail(vm.selectedEmail,vm.newStatus)" class="btn btn-default" ng-if="vm.newStatus!=vm.selectedEmail.status" >Update Status</button>' +
                    // '</md-content>' +
                    '<p class="text-right">' +
                        '<button ng-click="vm.closeDialog()" class="btn btn-default pull-left">Close</button>' +
                        '<button ng-click="vm.resendEmail(vm.selectedEmail)" class="btn btn-primary">Resend</button>' +
                    '</p>' +
                    '</md-content>'+
                '</div>'+
            '</md-dialog>',
        scope: $scope,
        preserveScope: true,
    })
}
function closeDialog(){
    $mdDialog.cancel();
}
  function toTitleCase(str) {
    if (typeof str === 'string') {
      return str.split('_').join(' ').replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); 
      });
    }
    else return null;
  }
  function payCreator(){
    closeDialog();
    Payment.payCreator(vm.profileId).then(function(res){
        UINotification.success("Payment Completed");
        loadProfileInfo();
      }).catch(function(err){
          UINotification.error(err.data.message);
      })
  }
  function orderStyle(index){
   return { 'background-color': vm.purchases.orders[index].style?'#f6f6f7':'',
                                                        'border-top-style': 'solid',
                                                        'border-top-color': '#e8e9ea',
                                                        'border-top-width': '1px',
                                                        'padding': '10px'}
  }
  function checkStatus(status){
    return listStatus.indexOf(status)>-1;
  }
}
])