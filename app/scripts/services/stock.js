'use strict';

angular.module('app').service('Stock', ['Api', '$q',
  function (Api,$q) {

    var data = {}
    var service = {
      getAllPackaging : getAllPackaging,
      getAllPackagingEnabled : getAllPackagingEnabled,
      getPackagingById : getPackagingById,
      setPackaging : setPackaging,
      setCriteria : setCriteria,
      setSupplier : setSupplier,
      updatePackaging : updatePackaging,
      updateCriteria : updateCriteria,
      updateCriteriaStatus : updateCriteriaStatus,
      updateSupplier : updateSupplier,
      deletePackaging : deletePackaging,
      deleteCriteria : deleteCriteria,
      deleteSupplier : deleteSupplier,

    }

    return service
    function getAllPackaging(clear){
      return Api.request({
        url: '/admin/order/packaging',
        cache:!clear,
      });
    }
    function getAllPackagingEnabled(){
      return Api.request({
        url: '/admin/order/packaging/enabled',
      });
    }
    function getPackagingById(id){
      return Api.request({
        url: '/admin/order/packaging/'+id,
      });
    }
    function setPackaging(data){
      return Api.request({
        url: '/admin/order/packaging',
        method: 'POST',
        data: data,
      });
    }
    function setCriteria(id,data){
      return Api.request({
        url: '/admin/order/packaging/'+id+'/criteria',
        method: 'POST',
        data: data,
      });
    }
    function setSupplier(id,data){
      return Api.request({
        url: '/admin/order/packaging/'+id+'/supplier',
        method: 'POST',
        data: data,
      });
    }
    function updatePackaging(data){
      return Api.request({
        url: '/admin/order/packaging/'+data.id,
        method: 'PUT',
        data: data,
      });
    }
    function updateCriteria(id,data){
      return Api.request({
        url: '/admin/order/packaging/'+id+'/criteria/'+data.id,
        method: 'PUT',
        data: data,
      });
    }
    function updateCriteriaStatus(id,data){
      return Api.request({
        url: '/admin/order/packaging/'+id+'/criteria/'+data.id+'/status',
        method: 'PUT',
        data: data.status,
        dataFormat: 'string'        
      });
    }
    function updateSupplier(id,data){
      return Api.request({
        url: '/admin/order/packaging/'+id+'/supplier/'+data.id,
        method: 'PUT',
        data: data,
      });
    }
    function deletePackaging(id){
      return Api.request({
        url: '/admin/order/packaging/'+id,
        method: 'DELETE',
      });
    }
    function deleteCriteria(id,data){
      return Api.request({
        url: '/admin/order/packaging/'+id+'/criteria/'+data.id,
        method: 'DELETE',
      });
    }
    function deleteSupplier(id,data){
      return Api.request({
        url: '/admin/order/packaging/'+id+'/supplier/'+data.id,
        method: 'DELETE',
      });
    }
  }
])

