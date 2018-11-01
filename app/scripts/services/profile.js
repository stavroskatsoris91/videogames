'use strict';

angular.module('app').service('Profile', ['Api',

  function (Api) {
    var service = {
      get : get,
      getFeatured : getFeatured,
      setFeatured : setFeatured,
      search : search,
      emailSearch : emailSearch,
      getCards : getCards,
      setTier : setTier,
      setCardLimit : setCardLimit,
      getNotes : getNotes,
      addNote : addNote,
      deleteNote : deleteNote,
      editEmail : editEmail,
      addCredits : addCredits,
      removeCredits : removeCredits,
      getTopSellers : getTopSellers,
      vatApprove : vatApprove,
      vatClose : vatClose,
      disableProfile : disableProfile,
      getBasket : getBasket,
      getCard : getCard,
      filterCsv : filterCsv,
      setProfileInfo : setProfileInfo,
      getPaymentMethod : getPaymentMethod,
      deletePaymentMethod : deletePaymentMethod,
      setRoyalties : setRoyalties,
    };
    return service;

    function get(profileId) {
      return Api.request({
        url: '/admin/profile/' + profileId
      });
    }

    function search(query) {
      return Api.request({
        url: '/admin/profile/search',
        data: {
          term: query
        },
        dataFormat: "urlParams",
        cache: false
      });
    }
    
    function emailSearch(email) {
      return Api.request({
        url: '/admin/profile/search/email',
        data: {
          term: email
        },
        dataFormat: "urlParams",
        cache: false
      });
    }

    function getFeatured() {
      return Api.request({
        url: '/admin/profile/featured/creators/'
      });
    }
    function setFeatured(profile,featured){
      return Api.request({
        url: '/admin/profile/featured/creator/'+profile+'?featured='+featured,
        method: 'PUT',
      })
    }
    function setTier(profile, value) {
        var data = {};
        var intValue;
        intValue = parseInt(value);
        data.creator_tier = intValue;
        return Api.request({
          url: '/admin/profile/tier/creator/' + profile,
          method: 'PUT',
          data: data,
          dataFormat: 'form',
          useUserToken: true
        });
    }
    function setCardLimit(profile, view, combo) {
        var data = {};
        var intValue;
        var maxIntegerSize = 2147483647;
        try {
          intValue = Number(view);
        } catch(ex) {
          return $q.reject(new Error("Not an integer:" + view));
        }
        if(intValue > maxIntegerSize) {
          return $q.reject('Value is too high.');
        }
        data.card_viewable_limit=intValue;
        try {
          intValue = Number(combo);
        } catch(ex) {
          return $q.reject(new Error("Not an integer:" + combo));
        }
        if(intValue > maxIntegerSize) {
          return $q.reject('Value is too high.');
        }
        data.card_combination_limit=intValue;
        return Api.request({
          url: '/admin/profile/cardlimit/' + profile,
          method: 'PUT',
          data: data,
          dataFormat: 'form',
          useUserToken: true
        });
    }
    
    function getCards(profileId,page) {
      return Api.request({
        url: '/admin/card/owner/' + profileId + "?page=" + page
      });
    }
    function getNotes(profileId) {
      return Api.request({
        url: '/admin/profile/'+profileId+'/notes',
        cache: false,
      });
    }
    function addNote(note,profileId) {
      var data = {};
      data.note=note;
        return Api.request({
          url: '/admin/profile/' + profileId + '/note',
          method: 'POST',
          data: data,
          dataFormat: 'form',
          useUserToken: true
        });
    }
    function deleteNote(noteId,profileId) {
        return Api.request({
          url: '/admin/profile/'+profileId+'/note/'+noteId,
          method: 'DELETE',
          useUserToken: true
        });
    }
    function editEmail(email,profileId){
      var data = {};
      data.new_email=email;
      return Api.request({
        url: '/admin/profile/email/'+ profileId,
        method: 'PUT',
        data: data,
        dataFormat: 'form',
        useUserToken: true
      })
    }
    function addCredits(amount,expiry,reason,profileId){
      var data = {};
      data.amount = amount;
      data.expiry = expiry.getTime();
      data.admin_reason = reason;
      return Api.request({
          url: '/admin/profile/addcredit/' + profileId,
          method: 'POST',
          returnWholeObject: false,
          useUserToken: true,
          data: data
      })
    }
    function removeCredits(amount,expiry,reason,profileId){
      var data = {};
      data.amount = -amount;
      data.reason = reason;
      return Api.request({
          url: '/admin/profile/removecredit/' + profileId,
          method: 'PUT',
          returnWholeObject: false,
          useUserToken: true,
          data: data,
          dataFormat: 'urlParams',
      })
    }
    function getTopSellers(date,page){
      //transform date
      var year = date.getUTCFullYear(); 
      var month = date.getUTCMonth() + 1;
      return Api.request({
        url : "/admin/profile/monthlysales?month=" + month +"&year=" + year + "&page=" + page
      })
    }
    function vatApprove(query,vatId,profileId){
      var data = {};
      data.vat_approved = query;
      data.vat_approved_id = vatId;

      return Api.request({
        url : "/admin/profile/"+ profileId,
        method: 'POST',
        useUserToken: true,
        data: data,
      })
    }
    function vatClose(id,date){
      date = date.toISOString().slice(0, 10);
      return Api.request({
        url : "/admin/profile/vat/close/"+ id,
        method: 'PUT',
        useUserToken: true,
        data: {vat_closure_date:date},
        dataFormat: 'urlParams',
      })
    }
    function disableProfile(status,profileId){
      if(status)
      {
        var active= "disable/"
      }
      else
      {
         var active= "enable/"
      }
      return Api.request({
        url : "/admin/profile/"+ active +profileId,
        method : 'PUT',
        useUserToken: true,
      })
    }
    function getBasket(profileId){
      return Api.request({
        url : "/admin/order/basket/profile/"+profileId,
        method: 'GET',
        cache: false,
        useUserToken: true,
      })
    }
    function getCard(cardId){
      return Api.request({
        //url : "/admin/card/"+cardId,
        url : "/v1/card?cards=" + cardId,
        method: 'GET',
        useUserToken: true,
      })
    }
    function filterCsv(csv){
      var tags=csv.tags?"&tags="+csv.tags:"";
      var categories=csv.categories?"&categories="+csv.categories:"";
      var coupon_codes=csv.coupon_codes?"&coupon_codes="+csv.coupon_codes:"";
      var campaign_ids=csv.campaign_ids?"&campaign_ids="+csv.campaign_ids:"";
      return Api.request({
        url : "/admin/data/profile/filter/buyers?"
        +"end_date="+csv.end_date
        +"&start_date="+csv.start_date
        +tags
        +categories
        +coupon_codes
        +campaign_ids,
        method: 'GET',
        cache: false,
        returnWholeObject : true,
      })
    }
    function setProfileInfo(profileId,data){
      var firstname = "?firstName="+data.firstname;
      var surname = "&surName="+data.surname;
      var bio =  "&bio="+(data.bio?data.bio:"...");
      return Api.request({
        url : "/admin/profile/"+profileId+firstname+surname+bio,
        method : "PUT",
        useUserToken: true,        
       })
    }
    function getPaymentMethod(id){
      return Api.request({
        url : "/admin/profile/paymethods/" + id,
        method: 'GET',
        cache: false,
        useUserToken: true,
      })
    }
    function deletePaymentMethod(paymentId,profileId) {
      return Api.request({
        url: '/admin/profile/'+profileId+'/remove/card/payment/'+paymentId,
        method: 'DELETE',
        useUserToken: true
      });
    }
    function setRoyalties(profileId,data){
      var format = angular.copy(data);
      format.new_royalty_start = data.new_royalty_start.toISOString().slice(0,10);
      return Api.request({
        url: '/admin/profile/royalty/'+profileId,
        method: 'PUT',
        data: format,
        dataFormat: 'urlParams',
      });
    }
  }
]);
