'use strict';

angular.module('app').service('Stats', ['Api', '$q',
  function (Api,$q) {

    var data = {}
    var service = {
      getCardSales : getCardSales,
      getOccasionCardSales : getOccasionCardSales,
      getOrderSales : getOrderSales,
      getTransactionSales : getTransactionSales,
      getCategorySales : getCategorySales,
      getProfilesCreated : getProfilesCreated,
      getDistinctBuyers : getDistinctBuyers,
      getOrderBySize : getOrderBySize,
      getProfilesRegistered : getProfilesRegistered,
      getItemOptionStock : getItemOptionStock,
      getProfileCsv : getProfileCsv,
      getOrderCsv : getOrderCsv,
      getCardCsv : getCardCsv,
      getHourlySales : getHourlySales,
      getUndeliveredOrders : getUndeliveredOrders,
      getDispatchLaterOrders : getDispatchLaterOrders,
      getStockConsumed : getStockConsumed,
      getOrderCreatedStatus : getOrderCreatedStatus,
      getOrderByStatus : getOrderByStatus,
    }

    return service

    // Generic function for stats endpoint returning data between 2 dates
    function statsByDate (endpoint,start,end) {
      // end date needs to be pushed to next day for it to be included
      var endDate = new Date(end.getTime() + 1* 24 * 60 * 60 * 1000);
      return Api.request({
        url: endpoint,
        data: {
          start_date: start.toISOString().slice(0,10),
          end_date: endDate.toISOString().slice(0,10)
        },
        dataFormat: 'urlParams'
      })
    }
    // Generic function for stats endpoint returning data between 2 dates
    function statsByDateExact(endpoint,start,end) {
      return Api.request({
        url: endpoint,
        data: {
          start_date: start.toISOString().slice(0,10),
          end_date: end.toISOString().slice(0,10)
        },
        dataFormat: 'urlParams'
      })
    }
    function getUndeliveredOrders (start,end) {
      return statsByDate("/admin/data/order/undelivered",start,end);
    }
    function getCardSales (start,end) {
      return statsByDate("/admin/data/order/sales/card/quantity",start,end);
    }
    function getOccasionCardSales (start,end,category) {
      return statsByDate("/admin/data/order/sales/card/category"+(category?"?category_id="+category:""),start,end);
    }
    function getProfilesCreated(start,end) {
      return statsByDate("/admin/data/profile/profilescreated",start,end);
    }
    function getOrderSales(start,end) {
      return statsByDate("/admin/data/order/sales/daily",start,end);
    }
    function getTransactionSales(start,end) {
      return statsByDate("/admin/data/order/transaction",start,end);
    }
    function getCategorySales(start,end) {
      return statsByDate("/admin/data/order/sales/categories",start,end);
    }
    function getDistinctBuyers(start,end) {
      return statsByDate("/admin/data/order/buyer",start,end);
    }
    function getOrderBySize(start,end) {
      return statsByDateExact("/admin/data/order/type/size",start,end);
    }
    function getProfilesRegistered(start,end) {
      return statsByDate("/admin/data/profile/profilescreated/buyer",start,end);
    }
    function getHourlySales(start,end){
      return statsByDate("/admin/data/order/stats/hourly/order",start,end);
    }
    function getStockConsumed(start,end){
      return statsByDate("/admin/data/stock/packaging/consumed",start,end);
    }
    function getOrderCreatedStatus(start,end){
      return statsByDate("/admin/data/order/orderscreated",start,end);
    }
    function getOrderByStatus(start,end,status){
      return statsByDate("/admin/data/order/status/report"+(status?"?status="+status:""),start,end);
    }
    function getItemOptionStock() {
      return Api.request({
        url: "/admin/order/itemoption"
      })
    }
    function getProfileCsv() {
      return Api.request({
        url: "/admin/data/profile/all/csv",
        cache: false,
      })
      
    }
    function getOrderCsv() {
      return Api.request({
        url: "/admin/data/order/all/csv",
        cache: false,
      })
    }
    function getCardCsv() {
      return Api.request({
        url: "/admin/data/card/all/csv",
        cache: false,
      })
    }
    function getDispatchLaterOrders(){
      return Api.request({
        url: "/admin/data/order/dispatch/later/report",
        cache: false,        
      })
    }
  }
])

