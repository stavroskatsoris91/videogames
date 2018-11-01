'use strict';

angular.module('app').service('Discount', ['Api',
  function (Api) {

    var service = {
      getCampaign : getCampaign,
      getSingleCoupon : getSingleCoupon,
      createCampaign : createCampaign,
      saveCampaign : saveCampaign,
      addCoupon : addCoupon,
      generateCoupons:generateCoupons,
      getCouponCSV : getCouponCSV,
    }

    return service
    function getCampaign(type,campaignId) {
      var campaign = searchType(type);
      if(!campaignId){
        campaignId = 'all';
      }
      return Api.request({
        url: "/admin/order/campaigns"+ campaign + campaignId
      })
    }
    function createCampaign(type,data) {
      var campaign = searchType(type);

      return Api.request({
        url: "/admin/order/campaigns"+ campaign,
        method: "POST",
        data: data,
      })
    }
    function saveCampaign(type,data){
      var campaign = searchType(type);
      return Api.request({
        url: "/admin/order/campaigns"+ campaign + data.id,
        method: "PUT",
        data: data,
      })
    }
    function getSingleCoupon(campaignId,page) {
      return Api.request({
        url: "/admin/order/campaigns/"+ campaignId +"/coupons/?page_number="+page,
        cache:false
      })
    }
    function getCouponCSV(campaignId,page) {
      return Api.request({
        url: "/admin/order/campaigns/"+ campaignId +"/coupons/?page_number="+page
      })
    }
    function addCoupon(data,campaignId){
      return Api.request({
        url: "/admin/order/campaigns/coupon/"+campaignId,
        method : "POST",
        data : [data]
      })
    }
    function generateCoupons(data,campaignId){
      return Api.request({
        url: "/admin/order/campaigns/coupon/generate/"+campaignId,
        method : "POST",
        data : data,
        cache : false,
      })
    }
    function searchType(type){
      if(type==='credits'){
        return '/coupon/credit/';
      }else if(type==='coupon'){
        return '/coupon/';
      }else if(type==='basket'){
        return '/';
      }else if(type==='referral'){
        return '/coupon/referral/';
      }else{ 
        return null;
      } 
    }
    
  }
])

