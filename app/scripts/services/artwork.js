'use strict';

angular.module('app').service('Artwork', ['Api',

  function (Api) {
    var service = {
      get : get,
      create : create,
      getAll : getAll,
      deleteTemplate : deleteTemplate,
      update : update,
      generateAll : generateAll,
      generateTemplate : generateTemplate
    };
    return service;

    function get(templateId) {
      return Api.request({
        url: '/admin/artwork/templates/' + templateId
      });
    }

    function getAll() {
      return Api.request({
        url: '/admin/artwork/templates'
      });
    }
    
    function update(template) {
      return Api.request({
        url: '/admin/artwork/templates/' + template.id,
        method : "PUT",
        data : template
      });
    }
    function create(template){
      return Api.request({
        url: '/admin/artwork/templates',
        method: 'POST',
        data : template
      });
    }

    function deleteTemplate(id) {
      return Api.request({
        url: '/admin/artwork/template/' + id,
        method : "DELETE"
      });
    }

    function generateAll() {
      return Api.request({
        url: '/admin/image/marketing/trigger/cardall',
        method : "POST"
      });
    }

    function generateTemplate(template) {
      return Api.request({
        url: '/admin/image/marketing/trigger/template/' + template.id,
        method : "POST"
      });      
    }
  }
]);