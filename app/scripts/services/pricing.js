'use strict';

angular.module('app').service('Pricing', ['Api',

  function (Api) {
    var service = {
      getList : getList,
      getCountries : getCountries,
      getPricing : getPricing,
      getPricingByFormat : getPricingByFormat,
      deleteRow : deleteRow,
      saveRow : saveRow,
      saveNewRow : saveNewRow,
      getDeliveryTime : getDeliveryTime,
      addDeliveryTime : addDeliveryTime,
      updateDeliveryTime : updateDeliveryTime,
      deleteDeliveryTime : deleteDeliveryTime,
      getHolidays : getHolidays,
      addHoliday : addHoliday,
      updateHoliday : updateHoliday,
      deleteHoliday : deleteHoliday,
    };
    return service;

    function getList() {
      return Api.request({
        url: '/admin/order/prices/tables',
      });
    }
    function getCountries(){
      return Api.request({
        url: '/admin/config/settings'
      })
    }
    function getDeliveryTime(){
      return Api.request({
        url: '/admin/order/delivery/time/all'
      })
    }


    function addDeliveryTime(data){
      return Api.request({
        url: '/admin/order/delivery/time',
        method: 'POST',
        data: data,
      })
    }
    function updateDeliveryTime(data){
      return Api.request({
        url: '/admin/order/delivery/time/'+data.id,
        method: 'PUT',
        data: data
      })
    }
    function deleteDeliveryTime(data){
      return Api.request({
        url: '/admin/order/delivery/time/'+data.id,
        method: 'DELETE'
      })
    }


    
    function getHolidays(){
      return Api.request({
        url: '/admin/order/delivery/holiday/all'
      })
    }
    function addHoliday(data){
      return Api.request({
        url: '/admin/order/delivery/holiday',
        method: 'POST',
        data: data,
      })
    }
    function updateHoliday(data){
      data.date = data.mdDate.getFullYear()+'-'+(data.mdDate.getMonth() + 1)+'-'+data.mdDate.getDate();

      return Api.request({
        url: '/admin/order/delivery/holiday/'+data.id,
        method: 'PUT',
        data: data,
      })
    }
    function deleteHoliday(data){
      return Api.request({
        url: '/admin/order/delivery/holiday/'+data.id,
        method: 'DELETE',
      })
    }



    function getPricing(id){
      return Api.request({
        url: '/admin/order/prices/table/'+id,
      })
    }
    function getPricingByFormat(id,format){
      return Api.request({
        url: '/admin/order/prices/rows/'+id+'?printer_format='+format,
        cache:false,
      })
    }
    function deleteRow(id){
      return Api.request({
        url : '/admin/order/prices/row/'+id,
        method: 'DELETE',
      })
    }
    function saveRow(row){
      var newRow = angular.copy(row);
      newRow.price.cost=row.price.cost.toString();
      return Api.request({
        url : '/admin/order/prices/row/'+row.id,
        method: 'PUT',
        useApiKeys: true,
        data: newRow,
      })
    }
    function saveNewRow(row){
      var newRow = angular.copy(row);
      newRow.price.cost=row.price.cost.toString();
      delete newRow.id;
      return Api.request({
        url : '/admin/order/prices/row/',
        method: 'POST',
        useApiKeys: true,
        data: newRow,
      })
    }
  }
]);