'use strict';

angular.module('app').service('Emojis', ['Api',
  function (Api) {
    var nextData;
    var service = {
      create : create,
      createImage : createImage,
      update : update,
      get : get,
      getList : getList,
      deleteEmoji : deleteEmoji,
      deleteImage : deleteImage,
    };
    return service;

    function create(data){
      return Api.request({
        url : "/admin/artwork/emoji",
        method : "POST",
        data : data,
      })
    }
    function createImage(data){
      var fd = new FormData();
      fd.append('emoji_id',data.emoji_id);
      fd.append('platform_type',data.platform_type);
      fd.append('image_size',data.image_size);
      fd.append('image_name',data.image_name);
      fd.append('file',data.image);
      return Api.request({
        url : "/admin/artwork/emoji/image",
        method : "POST",
        data: fd,
        dataFormat: "multipart",
      })
    }
    function update(data){
      return Api.request({
        url : "/admin/artwork/emoji/"+data.id,
        method : "PUT",
        data : data,
      })
    }
    function get(id){
      return Api.request({
        url : "/admin/artwork/emoji/"+id,
      })
    }
    function getList(){
      return Api.request({
        url : "/admin/artwork/emoji/",
      })
    }
    function deleteEmoji(id){
      return Api.request({
        url : "/admin/artwork/emoji/"+id,
        method : "DELETE",
      })
    }
    function deleteImage(data){
      delete data.image.image;
      return Api.request({
        url : "/admin/artwork/emoji/image/"+data.id,
        method : "DELETE",
        data: data.image,
        dataFormat: 'urlParams'
      })
    }
  }
]);
