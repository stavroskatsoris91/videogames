'use strict';

angular.module('app').service('Triggers', ['Api',

  function (Api) {
    var service = {
      countOrder : countOrder,
      countAllOrders : countAllOrders,
      countCard : countCard,
      countAllCards : countAllCards,
      countRankCards : countRankCards,
      countCampaign : countCampaign,
      countProfile : countProfile,
      countAllProfiles : countAllProfiles,
      countAllProfilesPlusRecent : countAllProfilesPlusRecent,
      cardReports : cardReports,
      sessionReports : sessionReports,
      newSessionTask : newSessionTask,
      taskProgress : taskProgress,
      mailChimpPushAll : mailChimpPushAll,
      mailChimpPullAll : mailChimpPullAll,
      mailChimpUpdateProfile : mailChimpUpdateProfile,
      triggerEmails : triggerEmails,
      triggerSelectedEmails : triggerSelectedEmails,
      refreshExplore : refreshExplore,
    };
    return service;
    function refreshExplore(){
      return Api.request({
        url: '/admin/explore/criteria/evic/cache',
        method: 'PUT',
      });
    }
    function countOrder(id) {
      return Api.request({
        url: '/admin/count/ordercount/' + id,
      });
    }
    function countAllOrders() {
      return Api.request({
        url: '/admin/count/order/countall'
      });
    }
    function countCard(id) {
      return Api.request({
        url: '/admin/count/cardcount/' + id,
      });
    }
    function countAllCards() {
      return Api.request({
        url: '/admin/count/card/countall',
      });
    }
    function countRankCards() {
      return Api.request({
        url: '/admin/count/card/rankall',
      });
    }
    function countProfile(id) {
      return Api.request({
        url: '/admin/count/profile/' + id,
      });
    }
    function countCampaign(id) {
      return Api.request({
        url: '/admin/count/campaign/' + id,
      });
    }
    function countAllProfiles() {
      return Api.request({
        url: '/admin/count/profile/count/all',
      });
    }
    function countAllProfilesPlusRecent() {
      return Api.request({
        url: '/admin/count/profile/all',
      });
    }
    function cardReports() {
      return Api.request({
        url: '/admin/count/card/create/reports',
      });
    }
    function sessionReports() {
      return Api.request({
        url: '/admin/count/session/create/reports',
      });
    }
    function newSessionTask() {
      return Api.request({
        url: '/admin/count/session/all',
      });
    }
    function taskProgress() {
      return Api.request({
        url: '/admin/count/tasks/progress',
      });
    }
    function mailChimpPushAll() {
      return Api.request({
        url: '/admin/notify/mailchimp/profile/pushall',
      });
    }
    function mailChimpPullAll() {
      return Api.request({
        url: '/admin/notify/mailchimp/profile/pullall',
      });
    }
    function mailChimpUpdateProfile(id) {
      return Api.request({
        url: '/admin/notify/mailchimp/profile/'+id,
      });
    }
    function triggerEmails(type) {
      return Api.request({
        url: '/admin/notify/trigger/emails?email_type='+type,
      });
    }
    function triggerSelectedEmails(status,id) {
      if(!id){
          id='';
      }
      return Api.request({
        url: '/admin/notify/emails?email_status='+status,//+'&profile_id='+id,
      });
    }

  }
]);