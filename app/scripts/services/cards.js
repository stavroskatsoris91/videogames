'use strict';

angular.module('app').service('Cards', ['Api',
  function (Api) {
    var nextData;
    var service = {
      get : get,
      getList : getList,
      getListByDate : getListByDate,
      getTopSelling : getTopSelling,
      getGroups : getGroups,
      getCategories : getCategories,
      getCardSales : getCardSales,
      approveCard : approveCard,
      reject : reject,
      report : report,
      cardOnCatalog : cardOnCatalog,
      saveTags : saveTags,
      saveFormats : saveFormats,
      saveCategory : saveCategory,
      setRate : setRate,
      replaceCard : replaceCard,
      getNext : getNext,
      setNext : setNext,
      getAllCategories : getAllCategories,
      getPrinterVersion : getPrinterVersion,
      triggerMarketing : triggerMarketing,
      secondaryImage : secondaryImage,
    };
    return service;
    function setNext(data){
      nextData=data;
    }
    function getNext(){
      
      return nextData;
    }
    function get(cardId) {
      return Api.request({
        url : '/admin/card/' + cardId,
        cache: false,        
      });
    }
    function getList(filter,retired,ordered,page){
      return Api.request({
        url : "/admin/card/"+filter+"?ordered="+ordered+"&retired="+retired+"&page="+page,
        cache: false,
      })
    }
    function statsByDate (endpoint,start,end,data) {
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
    function getListByDate(start,end,data){
      return statsByDate("/admin/data/card/new/card",start,end,data);
    }
    function getGroups(){
      return Api.request({
        url : "/admin/explore/filters/groups/all"
      })
    }
    function getCategories(){
      return Api.request({
        url :"/admin/category/all/complete"
      })
    }
    function getTopSelling(date,page) {
      //transform date
      var year = date.getUTCFullYear(); 
      var month = date.getUTCMonth() + 1;
      return Api.request({
        url : "/admin/card/monthlysales?month=" + month +"&year=" + year + "&page=" + page
      })
    }
    function getCardSales(cardId) {
      return Api.request({
        url : "/admin/card/sales/" +cardId
      })
    }
    function approveCard(card,visibility) {
      card.moderation={status: 'MODERATED'};
      card.visibility = visibility;
      return Api.request({
        url : '/admin/card/' + card.card_id,
        method: "PUT",
        data : card,
      })
    }
    function reject(card,feedback) {
      if(!feedback){
        feedback = "no feedback";
      }
      card.moderation = {status: 'MODERATED',feedback: feedback};
      card.visibility = 'REJECTED';
      return Api.request({
        url : '/admin/card/' + card.id,
        method : "PUT",
        data : card,
      })
    }
    function report(card,feedback) {
      if(!feedback){
        feedback = "no feedback";
      }
      card.moderation = {status: 'REPORTED',feedback: feedback};
      card.visibility = 'REJECTED';    
      return Api.request({
        url : '/admin/card/' + card.id,
        method : "PUT",
        data : card,
      })
    }
    function cardOnCatalog(card,visibility) {
      card.moderation= { status: 'MODERATED'};
      if(visibility==='PUBLIC')
      {
        card.visibility='THORTFUL';
      }
      else{
        card.visibility='PUBLIC';
      }
      return Api.request({
        url : '/admin/card/' + card.id,
        method: "PUT",
        data : card,
      })
    }
    function saveTags(card,tags,visibility) {
      card.tags = tags;
      card.visibility = visibility;
      return Api.request({
        url : '/admin/card/' + card.id,
        method: "PUT",
        data : card,
      })
    }
    function saveFormats(card,formats,visibility) {
      card.creator_formats = formats;
      card.visibility = visibility;
      return Api.request({
        url : '/admin/card/' + card.id,
        method: "PUT",
        data : card,
      })
    }
    function saveCategory(card,categories,visibility) {
      card.categories = categories;
      card.visibility = visibility;
      return Api.request({
        url : '/admin/card/' + card.id,
        method: "PUT",
        data : card,
      })
    }
    function setRate(card,rate,visibility){
      card.global_moderator_rank = rate;
      card.visibility = visibility;
      return Api.request({
        url : '/admin/card/' + card.id,
        method: "PUT",
        data : card,
      })
    }
    function replaceCard(card,state,reason,visibility) {
      card.card_replacement_information =  {
        replacement_state: state,
        rejected_reason : reason
        };
      card.visibility= visibility;
      return Api.request({
        url : '/admin/card/' + card.id,
        method: "PUT",
        data : card,
      })
    }
    function getAllCategories(){
      return Api.request({
        url : '/admin/category/search/all/complete',
      })
    }
    function createCategory(data){
      return Api.request({
        url : '/admin/category/search/group',
        method: "POST",
        data: data
      })
    }
    function updateCategory(categoryId,data){
      return Api.request({
        url : '/admin/category/search/group/'+categoryId,
        method: "PUT",
        data: data
      })
    }
    function getCategoriesSearchGroup(categoryId){
      return Api.request({
        url : '/admin/category/search/query/'+categoryId,
      })
    }
    function createCategorySearchQuery(categoryId,file){
      return Api.request({
        url : '/admin/category/search/query/',
        method: "POST",
        data: file
      })
    }
    function updateCategorySearchQuery(categoryId,data){
      return Api.request({
        url : '/admin/category/search/query/'+categoryId,
        method: "PUT",
        data: data
      })
    }
    function getPrinterVersion(cardId) {
      return Api.request({
        url : '/admin/printer/proco/card/sample/' + cardId
      })
    }

    function triggerMarketing(cardId){
      return Api.request({
        url : '/admin/image/marketing/trigger/card/' + cardId,
        method: "POST",
      })
    }
    function secondaryImage(cardId,image){
      var fd = new FormData();
      fd.append('card_id',cardId);
      fd.append('file',image);
      return Api.request({
        url : '/admin/card/secondary-image/upload',
        method: "POST",
        data: fd,
        dataFormat: "multipart",    
      })
    }
  }
]);
