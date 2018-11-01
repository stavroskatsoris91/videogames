'use strict';

angular.module('app').service('Categories', ['Api',
  function (Api) {
    var nextData;
    var service = {
      getGroups : getGroups,
      getFilters : getFilters,
      getCategories : getCategories,
      createCategory : createCategory,
      getCategory : getCategory,
      updateCategory : updateCategory,
      updateCategoryImage : updateCategoryImage,
      addCategoryImage : addCategoryImage,
      deleteCategoryImage : deleteCategoryImage,
      createCategoryFilter : createCategoryFilter,
      updateCategoryFilter : updateCategoryFilter,
      getCategoryFilter: getCategoryFilter,
      getAllCategoryFilter: getAllCategoryFilter,
      deleteCategoryFilter: deleteCategoryFilter,
      getCategoriesSearchGroup : getCategoriesSearchGroup,
      createCategorySearchGroup : createCategorySearchGroup,
      updateCategorySearchGroup : updateCategorySearchGroup,
      getCategoriesSearchQuery : getCategoriesSearchQuery,
      createCategorySearchQuery : createCategorySearchQuery,
      updateCategorySearchQuery : updateCategorySearchQuery,
      deleteCategorySearchQuery : deleteCategorySearchQuery,
      updateCategorySearchQueryImage : updateCategorySearchQueryImage,
      getFilterGroup :getFilterGroup,
      updateFilterGroup :updateFilterGroup,
      createFilterGroup :createFilterGroup,
      deleteFilterGroup : deleteFilterGroup,
      getFilter :getFilter,
      updateFilter :updateFilter,
      createFilter :createFilter,
      deleteFilter : deleteFilter,
    };
    return service;
    function getGroups(){
      return Api.request({
        url : "/admin/explore/filters/groups/all",
        cache : false        
      })
    }
    function getFilters(){
      return Api.request({
        url : "/admin/explore/filters/all",
        cache : false        
      })
    }
    function getCategories(){
      return Api.request({
        url :"/admin/category/all/complete",
      })
    }
    function createCategory(image,category){
      var fd = new FormData();
      fd.append('file', image);
      fd.append('category', JSON.stringify(category));
      return Api.request({
        url :"/admin/category/create",
        method : "POST",
        data : fd,
        useUserToken: true,
        dataFormat: "multipart",
      })
    }
    function getCategory(id){
      return Api.request({
        url :"/v1/category/id/"+id,
        cache : false        
      })
    }
    function updateCategory(data){
      return Api.request({
        url :"/admin/category",
        method : "PUT",
        data : data
      })
    }
    function updateCategoryImage(image,id){
      var fd = new FormData();
      fd.append('file', image);
      fd.append('category_id',id);

      return Api.request({
        url : "/admin/category/image/",
        method : "POST",
        data: fd,
        dataFormat: "multipart",
      })
    }
    function addCategoryImage(data,id){
      var fd = new FormData();
      fd.append('file', data.image);
      fd.append('platform_type',data.platform_type);
      fd.append('image_size',data.image_size);
      fd.append('image_name',data.image_name);

      return Api.request({
        url : "/admin/category/image/platform/"+id,
        method : "POST",
        data: fd,
        dataFormat: "multipart",
      })
      
    }
    function deleteCategoryImage(data,id){
      var fd = new FormData();

      var platform_type='?platform_type='+data.platform_type;
      var image_size ='&image_size='+data.image_size;
      var image_name='&image_name='+data.image_name;
      return Api.request({
        url :"/admin/category/image/platform/"+id+platform_type+image_size+image_name,
        method : "DELETE",
      })
      
    }
    function createCategoryFilter(image,filter){
      var fd = new FormData();
      fd.append('file', image);
      fd.append('category_filter', JSON.stringify(filter));
      return Api.request({
        url :"/admin/category/filter",
        method : "POST",
        data : fd,
        dataFormat: "multipart",
      })
    }
    function updateCategoryFilter(image,filter){
      var fd = new FormData();
      if(image){
        fd.append('file', image);
        delete filter.image;
      }

      fd.append('category_filter', JSON.stringify(filter));
      return Api.request({
        url :"/admin/category/filter/"+filter.id,
        method : "POST",
        data : fd,
        dataFormat: "multipart",
      })
    }
    function getCategoryFilter(){
      return Api.request({
        url :"/admin/category/filter/"+id,
      })
    }
    function getAllCategoryFilter(){
      return Api.request({
        url :"/admin/category/filter/all",
      })
    }
    function deleteCategoryFilter(id){
      return Api.request({
        url :"/admin/category/filter/"+id,
        method : "DELETE",
      })
    }
    function getCategoriesSearchGroup(){
      return Api.request({
        url : '/admin/category/search/group/all',
      })
    }
    function createCategorySearchGroup(data){
      return Api.request({
        url : '/admin/category/search/group',
        method: "POST",
        data: data
      })
    }
    function updateCategorySearchGroup(categoryId,data){
      return Api.request({
        url : '/admin/category/search/group/'+categoryId,
        method: "PUT",
        data: data
      })
    }
    function getCategoriesSearchQuery(categoryId){
      return Api.request({
        url : '/admin/category/search/query/'+categoryId,
      })
    }
    function createCategorySearchQuery(category,data){
      var file = new FormData();
      file.append('file', data);
      var string = JSON.stringify(category);
      string = encodeURI(string);
      console.log(string);
      return Api.request({
        url : '/admin/category/search/query?category_search_query='+string,
        method: "POST",
        data: file,
        dataFormat: "multipart",
      })
    }
    function updateCategorySearchQuery(categoryId,data){
      return Api.request({
        url : '/admin/category/search/query/'+categoryId,
        method: "PUT",
        data: data
      })
    }
    function deleteCategorySearchQuery(queryId){
      return Api.request({
        url : '/admin/category/search/query/'+queryId,
        method: "DELETE",
      })
    }
    function updateCategorySearchQueryImage(data,id)
    {
      var file = new FormData();
      file.append('file', data);
      console.log(file);      
      return Api.request({
        url : '/admin/category/search/query/'+id,
        method: "POST",
        data: file,
        dataFormat: "multipart",
      }) 
    }
    function getFilterGroup(groupId){
      return Api.request({
        url : '/admin/explore/filter/group/'+groupId,
        method: "GET",
      })
    }
    function updateFilterGroup(group){
      return Api.request({
        url : '/admin/explore/filter/group/'+group.id,
        method: "PUT",
        data : group,
      })
    }
    function createFilterGroup(group){
      return Api.request({
        url : '/admin/explore/filter/group',
        method: "POST",
        data : group,
      })
    }
    function deleteFilterGroup(groupId){
      return Api.request({
        url : '/admin/explore/filter/group/'+groupId,
        method: "DELETE",
      })
    }
    function getFilter(filterId){
      return Api.request({
        url : '/admin/explore/filter/'+filterId,
        method: "GET",
      })
    }
    function updateFilter(filter){
      return Api.request({
        url : '/admin/explore/filter/'+filter.id,
        method: "PUT",
        data : filter,
      })
    }
    function createFilter(filter){
      return Api.request({
        url : '/admin/explore/filter',
        method: "POST",
        data : filter,
      })
    }
    function deleteFilter(filterId){
      return Api.request({
        url : '/admin/explore/filter/'+filterId,
        method: "DELETE",
      })
    }
  }
]);
