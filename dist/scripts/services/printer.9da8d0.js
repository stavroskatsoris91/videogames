'use strict';

angular.module('app').service('Printer', ['Api',

  function (Api) {
    var service = {
      get : get,
      getPrinterInfo : getPrinterInfo,
      updateInfo : updateInfo,
      updatePrinter : updatePrinter,
      setPrinter : setPrinter,
      deletePrinter : deletePrinter,
    };
    return service;

    function get() {
      return Api.request({
        url: '/admin/printer/info/all',
        cache: false
      });
    }
    function getPrinterInfo(printerId) {
      return Api.request({
        url: '/admin/printer/info/'+printerId,
        cache: false
      });
    }
    function updateInfo(printerId,data) {
      return Api.request({
        url: '/admin/printer/info/printing/'+printerId,
        data: data,
        method: 'PUT',
        dataFormat: 'urlParams'
      });
    }
    function setPrinter(printer) {
      return Api.request({
        url: '/admin/order/printer/info',
        method: 'POST',
        data: printer,
      });
    }
    function updatePrinter(printer) {
      return Api.request({
        url: '/admin/order/printer/info/'+printer.id,
        method: 'PUT',
        data: printer,
      });
    }
    function deletePrinter(printer) {
      return Api.request({
        url: '/admin/order/printer/info/'+printer.id,
        method: 'DELETE',
      });
    }
  }
]);