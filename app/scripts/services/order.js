'use strict';

angular.module('app').service('Order', ['Api',

  function (Api) {
    var service = {
      get : get,
      getAll : getAll,
      getAllHistory : getAllHistory,
      getAllByProfileId : getAllByProfileId,
      getFilter : getFilter,
      searchByProcoId : searchByProcoId,
      searchByProcoItemId: searchByProcoItemId,
      searchByCustomerId : searchByCustomerId,
      searchByTransactionId : searchByTransactionId,
      searchByAddress : searchByAddress,
      setDelivery : setDelivery,
      setItemOptions : setItemOptions,
      reprint : reprint,
      refund : refund,
      markAsDelivered : markAsDelivered,
      sentToPrinter : sentToPrinter,
      changeMessage : changeMessage,
      stopOrder : stopOrder,
      multiAddressOrder : multiAddressOrder,
      // Managing available options for card in order 
      getItemOptions : getItemOptions,
      getItemOption : getItemOption,
      createItemOption : createItemOption,
      updateItemOption : updateItemOption,
      updateCardsItemOption : updateCardsItemOption,
      getSample : getSample,
      getBestArrivalDate :getBestArrivalDate,
      getBestArrivalDate2 :getBestArrivalDate2,
      getDeliveryTime : getDeliveryTime,
      getStatusList : getStatusList,

    };
    return service;

    function getStatusList(){
      return [
        'PAID',
        'UNFIT_FOR_PRINT',
        'PRINTING_ERROR',
        'UNKNOWN',
        'SENT_TO_PRINTER',
        'PRINTING',
        'REQUIRES_REPRINT',
        'CUSTOMER_REPRINT',
        'SENT',
        'UNDELIVERED',
        'DELIVERED',
        'REFUNDED',
        'REQUIRES_REFUND',
        'REFUND_PENDING',
        'STATUS_ERROR',
        'STOPPED'];
    }
    function get(orderId) {
      return Api.request({
        url: '/admin/order/' + orderId,
        cache: false
      });
    }
    function getAll(params,cache) {
      // start = format.start_date.toISOString().slice(0,10);
      // end = format.end_date.toISOString().slice(0,10);
      return Api.request({
        url: '/admin/order/all', //+'&start_date='+start+'&end_date='+end,
        cache: cache,
        data : params,
        dataFormat : 'urlParams', 

      });
    }

    function getAllByProfileId(profileId, page,cache){
      return Api.request({
        url: '/admin/order/profile/'+profileId+'?page_number=' + page,
        cache : cache
      });
    }
    function getByDate (endpoint,start,end,data) {
      // end date needs to be pushed to next day for it to be included
      var endDate = new Date(end.getTime() + 1* 24 * 60 * 60 * 1000);
      data.start_date =  start.toISOString().slice(0,10);
      data.end_date = endDate.toISOString().slice(0,10);
      return Api.request({
        url: endpoint,
        data: data,
        dataFormat: 'urlParams'
      })
    }
    function getAllHistory(start,end,data){
      return getByDate("/admin/order/all/history",start,end,data);
    }
    function getFilter(filter,page,cache){
      return Api.request({
        url: '/admin/order/status/'+filter+'?page_number=' + page,
        cache : cache
      });
    }   
    function searchByProcoId(procoId,cache){
      return Api.request({
        url: '/admin/order/proco/'+procoId,
        cache : cache
      });
    }
    function searchByProcoItemId(procoItemId,cache){
      return Api.request({
        url: "/admin/order/proco/item/"+ procoItemId,
        useUserToken: true,
        cache : cache
      })
    }
    function searchByCustomerId(customerId,cache){
      return Api.request({
        url: '/admin/order/readable/' + customerId,
        cache : cache
      });
    }
    function searchByTransactionId(transactionId,cache){
      var par = {
        transaction_id:transactionId
      }
      return Api.request({
        url: '/admin/order/payment/transaction',
        data: par,
        dataFormat: 'urlParams',
        cache : cache
      });
    }
    function searchByAddress(data,cache){
      var par = {
        recipient_name:data.recipient,
        recipient_postcode:data.postcode
      }
      return Api.request({
        url: '/admin/order/search/address',
        data: par,
        dataFormat: 'urlParams',
        cache : cache,
      });
    }
    function setDelivery(orderId,address,date,recipient) {
      var data = {};
      data.delivery_address = address;
      if(date){
        data.requested_arrival_date = date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate();
      }else{
        data.requested_arrival_date = null;
        //data.dispatch_type = 'IMMEDIATE';
      }
      data.recipient_type = recipient;
      
      return Api.request({
        url: '/admin/order/'+ orderId,
        method: 'PUT',
        data: data,
        cache: false,
        dataFormat: 'json',
        useUserToken: true})
    }
    function setItemOptions(order) {
      
      return Api.request({
        url: '/admin/order/'+ order.id,
        method: 'PUT',
        data: {'order_options':order.order_options},
        dataFormat: 'json',
      })
    }
    function reprint(orderId){
      return Api.request({
        url: '/admin/order/reprint/'+ orderId,
        method: 'PUT',
      })
    }
    function refund(orderId,stripeReason,thortfulReason) {
      var data = {};
      data.stripe_reason = stripeReason;
      data.thortful_reason = thortfulReason;
      return Api.request({
        url: '/admin/order/refund/'+ orderId,
        method: 'PUT',
        data: data,
        dataFormat: 'form',
        useUserToken: true
      });
    }
    function markAsDelivered(orderId,delivered) {
      var data = {};
      if(delivered){
      data.order_status='DELIVERED';}
      else{data.order_status='UNDELIVERED';}
      return Api.request({
        url: '/admin/order/' + orderId + '/delivered',
        method: "PUT",
        data: data,
        dataFormat: "form",
        useUserToken: true,        
      });
        
    }
    function stopOrder(orderId) {
      var data = {};
      data.order_status="STOPPED";
      return Api.request({
        url: '/admin/order/' + orderId,
        method: "PUT",
        data: data,
        useUserToken: true,        
      });
        
    }
    function sentToPrinter(orderId) {
      var data = {};
      data.dispatch_date = new Date().toISOString().slice(0,10);
      
      return Api.request({
        url: '/admin/order/'+ orderId,
        method: 'PUT',
        data: data,
        dataFormat: 'json',
        useUserToken: true
      })
    }
    function changeMessage(orderId,cardId,text)
    {
      var data = {};
      data.text_customisation = text
      return Api.request({
        url: '/admin/order/'+orderId+'/card/'+cardId,
        method: 'PUT',
        data: data,
        //dataFormat: 'json',
        useUserToken: true
      })
    }
    function multiAddressOrder(multyOrderId)
    {
      return Api.request({
        url: '/admin/order/multiaddress/'+multyOrderId,
        cache: false,
      })
    }

    // 
    // Item Options management
    //

    function getItemOptions() {
      return Api.request({
        url: '/admin/order/itemoption'
      })
    }
    
    function getItemOption(id) {
      return Api.request({
        url: '/admin/order/itemoption/' + id
      })
    }

    function createItemOption(item) {
      return Api.request({
        url: '/admin/order/itemoption',
        method: 'POST',
        data: item,
        dataFormat: 'json',
        useUserToken: true});
    }

    function updateItemOption(item) {
      return Api.request({
        url: '/admin/order/itemoption/'+item.id,
        method: 'PUT',
        data: item,
        dataFormat: 'json',
        useUserToken: true});
    }
    function getSample(orderId){
      return Api.request({
        url: "/admin/printer/proco/sample/"+orderId,
        method: 'GET',
        cache: false
      })
    }
    function getBestArrivalDate(code){
      var data={country:{"code":code},dispatch_type:"IMMEDIATE"};
      return Api.request({
        url: "/v1/order/delivery/arrival",
        method: 'POST',
        data: data,
      })
    }
    function getBestArrivalDate2(code,date){
      var data={dispatch_type:"LATER",country:{"code":code},
      requested_arrival_date:date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate()}
      return Api.request({
        url: "/v1/order/delivery/arrival",
        method: 'POST',
        data: data,
      })
    }
    function getDeliveryTime(){
      return Api.request({
        url: '/admin/order/delivery/time/all'
      })
    }
    function updateCardsItemOption(orderId,item){

      return Api.request({
        url: '/admin/order/'+orderId+'/item/'+item.id,
        method: 'PUT',
        data: {"item_options" : item.item_options},
        dataFormat: 'json',
      });
    }
  }
]);