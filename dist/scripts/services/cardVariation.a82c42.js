'use strict';

angular.module('app').service('CardVariation', ['Api',
  function (Api) {
    var nextData;
    var service = {
      getAll : getAll,
      getSettings : getSettings,
      get : get,
      createCardVariation : createCardVariation,
      updateCardVariation : updateCardVariation,
      deleteCardVariation : deleteCardVariation,
      createAssetImage : createAssetImage,
      deleteAssetImage : deleteAssetImage,
      deleteAsset : deleteAsset,
      updateAsset : updateAsset,

    };
    return service;

    function getAll(){
      return Api.request({
        url : "/admin/order/cardvariation",
        cache : false,
      })
    }
    function getSettings(){
      return Api.request({
        url : "/admin/config/settings"
      })
    }
    function get(id){
      return Api.request({
        url :"/admin/order/cardvariation/"+id,
        cache : false,        
      })
    }
    function createCardVariation(data){
      return Api.request({
        url :"/admin/order/cardvariation",
        method : "POST",
        data : data,
      })
    }
    function updateCardVariation(data){
      return Api.request({
        url :"/admin/order/cardvariation/"+data.id,
        method : "PUT",
        data : data,
        useUserToken: true,      
      })
    }
    function deleteCardVariation(id){
      return Api.request({
        url :"/admin/order/cardvariation/"+id,
        method : "DELETE",
      })
    }
    function createAssetImage(data){
      var fd = new FormData();
      fd.append('asset_id',data.asset_id);
      fd.append('card_variation_id',data.card_variation_id);
      fd.append('platform_type',data.platform_type);
      fd.append('image_size',data.image_size);
      fd.append('image_name',data.image_name);
      fd.append('file',data.image);
      return Api.request({
        url :"/admin/order/cardvariation/assets",
        method : "POST",
        data: fd,
        dataFormat: "multipart",        
      })
    }
    function deleteAssetImage(data){
      var param = '?platform_type='+data.platform_type+
      '&image_size='+data.image_size+
      '&image_name='+data.image_name+
      '&card_variation_id='+data.card_variation_id;
      return Api.request({
        url : "/admin/order/cardvariation/assetimage/"+data.asset_id+param,
        method : "DELETE",
      })
      
    }
    function deleteAsset(asset,variation){
      return Api.request({
        url : "/admin/order/cardvariation/asset/"+asset.asset_id,
        method : "DELETE",
        data: { card_variation_id:variation },
        dataFormat: 'urlParams',
      })
    }
    function updateAsset(asset,variation){
      var fd = new FormData();
      fd.append('asset_id',asset.asset_id);
      fd.append('name',asset.name);
      fd.append('card_variation_id',variation);
      return Api.request({
        url : "/admin/order/cardvariation/assets",
        method : "POST",
        data: fd,
        dataFormat: "multipart",
      })
    }
  }
]);
