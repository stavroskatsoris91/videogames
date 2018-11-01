'use strict';

angular.module('app').service('Advert', ['Api',
  function (Api) {

    var service = {
      getAdvertList : getAdvertList,
      getAdvert : getAdvert,
      updateAdvert : updateAdvert,
      createAdvert : createAdvert,
      uploadImage : uploadImage,
      deleteImageAdvert : deleteImageAdvert,
    }

    return service
    function getAdvertList() {
      return Api.request({
        url: "/admin/content/all"
      })
    }
    function getAdvert(advertId) {
      return Api.request({
        url: "/admin/content/"+advertId
      })
    }
    function updateAdvert(advert) {
      return Api.request({
        url: "/admin/content/"+advert.id,
        method: "PUT",
        data : advert
      })
    }
    function createAdvert(data) {
      return Api.request({
        url: "/admin/content/",
        method: "POST",
        data: data,
      })
    }
    function uploadImage(advertId,data) {
      var fd = new FormData();
      fd.append('file', data.image);
      fd.append('platform_type',data.platform_type);
      fd.append('image_size',data.image_size);
      fd.append('image_name',data.image_name);

      return Api.request({
        url: "/admin/content/image/"+advertId,
        method: "POST",
        data: fd,
        dataFormat: "multipart",
      })
    }
    function deleteImageAdvert(advertId,data) {
      var parameters = "?image_name="+data.image_name+
            "&image_size="+data.image_size+
            "&platform_type="+data.platform_type;
      return Api.request({
        url: "/admin/content/image/"+advertId+parameters,
        method: "DELETE",
      })
    }
  }
])

