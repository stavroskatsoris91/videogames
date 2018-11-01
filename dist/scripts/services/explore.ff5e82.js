'use strict';

angular.module('app').service('Explore', ['Api',
  function (Api) {
    var service = {
      getAllIndex : getAllIndex,
      getIndexById : getIndexById,
      updateIndex : updateIndex,
      deleteIndex : deleteIndex,
      createIndex : createIndex,
      getCardRankById : getCardRankById,
      getCardRankByIndexId : getCardRankByIndexId,
      createQueryCard : createQueryCard,
      updateQueryCard : updateQueryCard,
      deleteQueryCard : deleteQueryCard,
      getCard : getCard,
    };
    return service;


    function getAllIndex(){
      return Api.request({
        url : "/admin/explore/index/all",
        cache : false 
      })
    }
    function getIndexById(id){
      return Api.request({
        url : "/admin/explore/index/"+id,
        cache : false 
      })
    }
    function updateIndex(data,id){
      return Api.request({
        url :"/admin/explore/index/query/update/"+id,
        method : "PUT",
        data : data
      })
    }
    function deleteIndex(id){
      return Api.request({
        url :"/admin/explore/index/query/delete/"+id,
        method : "DELETE",
      })
    }
    function createIndex(data){
      return Api.request({
        url :"/admin/explore/index",
        method : "POST",
        data : data,
      })
    }
    function getCardRankById(id){
      return Api.request({
        url : "/admin/explore/index/query/card/"+id,
        cache : false 
      })
    }
    function getCardRankByIndexId(id,hash){
      return Api.request({
        url : "/admin/explore/index/query/card",
        cache : false,
        data: {index_query_id:id,index_query_hash:hash},
        dataFormat: 'urlParams'    
      })
    }
    function createQueryCard(data){
      // data ={ index_query_id:index_query_id,
      //         index_query_hash:index_query_hash,
      //         card_id:card_id,
      //         rank:rank};
      return Api.request({
        url :"/admin/explore/index/card",
        method : "POST",
        data: data,
        dataFormat: 'urlParams' 
      })
    }
    function updateQueryCard(data,id){
      return Api.request({
        url :"/admin/explore/index/card/"+id,
        method : "PUT",
        data: data,
      })
    }
    function deleteQueryCard(id){
      return Api.request({
        url :"/admin/explore/index/card/"+id,
        method : "DELETE",
      })
    }
    function getCard(cardId){
      return Api.request({
        //url : "/admin/card/"+cardId,
        url : "/v1/card?cards=" + cardId,
      })
    }
  }
]);
