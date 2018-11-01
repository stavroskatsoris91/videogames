'use strict';

angular.module('app').service('Email', ['Api',
  function (Api) {
    var service = {
      getProfileEmails : getProfileEmails,
      getOrderEmails : getOrderEmails,
      updateEmailStatus : updateEmailStatus,
      resendEmail : resendEmail,
    };
    return service;


    function getProfileEmails(id,status){
      //NONE, NEEDS_TO_SEND, SENT, ERROR
      data = {
        profile_id :id,
        email_status : status?status:'NONE'
      };
      return Api.request({
        url : "/admin/notify/mails",
        cache : false,
        data: data,
        dataFormat: 'urlParams'
      })
    }
    function getOrderEmails(id,data){
      return Api.request({
        url : "/admin/notify/mails/order?multi_order_id="+id,
        cache : false,
      })
    }
    function updateEmailStatus(id,status){
      //NONE, NEEDS_TO_SEND, SENT, ERROR
      return Api.request({
        url :"/admin/notify/mails/"+id,
        method : "POST",
        data : {email_status:status},
        dataFormat: 'urlParams'
      })
    }
    function resendEmail(id,type){
      // CONFIRM_ORDER, DISPATCHED_ORDER, REFUNDED_ORDER
      return Api.request({
        url :"/admin/notify/mail/order/resend/"+id,
        method : "POST",
        data : {email_type:type},
        dataFormat: 'urlParams'
      })
    }
  }
]);
