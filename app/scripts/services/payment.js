'use strict';

angular.module('app').service('Payment', ['Api',

  function (Api) {
    var service = {
      unpaidCreators : unpaidCreators,
      unpaidCreatorsReport : unpaidCreatorsReport,
      payCreator : payCreator,
      getPayment : getPayment,
      triggerUpdatePayment : triggerUpdatePayment,
      triggerCancelPayment : triggerCancelPayment,
      creatorsPayments : creatorsPayments,
      totalPayments : totalPayments,
      vatCreators : vatCreators,
      generateVat : generateVat,
      massivePayment : massivePayment,
      recordPayment : recordPayment,
      paymentReport : paymentReport,
    };
    return service;

    function unpaidCreators(page,dir,key){
      //page_number=0
      //sort_dir=asc
      //sort_key=unpaid_amount
      return Api.request({
        url : "/admin/profile/creators/unpaid"+data,
        data: {
          page_number: page,
          sort_dir: dir,
          sort_key: key
        },
        dataFormat: 'urlParams'
      })
    }
    function unpaidCreatorsReport(min,clear){
      return Api.request({
        url : "/admin/profile/unpaid/creators/report",
        data: {min_amount: min},
        dataFormat: 'urlParams',
        cache: !clear
      })
    }
    function payCreator(id,data){
      var min = data?"?min_amount="+data:"";
      return Api.request({
        url : "/admin/payment/creator/" + id + min,
        method : "POST"
      })
    }
    function getPayment(id){
      return Api.request({
        url : "/admin/payment/" + id,
      })
    }
    function triggerUpdatePayment(id){
      return Api.request({
        url : "/admin/payment/" + id,
      })
    }
    function triggerCancelPayment(id){
      return Api.request({
        url : "/admin/payment/cancel/" + id,
      })
    }
    function creatorsPayments(id,data){
      var page  = "?page=" + data>0?data: "0";
      return Api.request({
        url : "/admin/payment/creator/" + id + page,
      })
    }
    function totalPayments(page, sort){
      return Api.request({
        url : "/admin/payment/creator/paypal/payouts",
        data: {
          page: page,
          sort_direction: sort
        },
        dataFormat: 'urlParams'
      })
    }
    function vatCreators(page, status){
      return Api.request({
        url : "/admin/profile/creators/vat",
        data: {
          moderation_status: status,
          page: page
        },
        dataFormat: 'urlParams'
      })
    }
    function generateVat(id){
      return Api.request({
        url : "/admin/profile/vat-invoice/"+id,
      })
    }
    function massivePayment(min){
      return Api.request({
        url : "/admin/payment/creators",
        method: "POST",
        data: {min_amount: min},
        dataFormat: 'urlParams',
        returnWholeObject : true,        
      })
    }
    function recordPayment(id,amount,quantity,date){
      var data={
                amount:{
                        code:"GBP",
                        amount:amount},
                date:date.toISOString().slice(0,10),
                card_quantity:quantity}
      return Api.request({
        url : "/admin/profile/creator/payouts/manual/"+id,
        method: "POST",
        data: data,
      })
    }
    function paymentReport(date){
      var reportDate = date.toISOString().slice(0,10);
      return Api.request({
        url : "/admin/data/profile/payment/creator/payouts/month",
        data: {date: reportDate},
        dataFormat: 'urlParams',
        transformResponse: false,
        returnWholeObject : true,        
      })
    }
  }
]);
