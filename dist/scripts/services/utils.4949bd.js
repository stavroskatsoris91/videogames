'use strict';

angular.module('app').service('Utils', [

  function () {
    var service = {
      graphGroupBy : graphGroupBy,
      toJSDateString : toJSDateString,
      objectToObjectArray : objectToObjectArray,
      csvDownload : csvDownload,
      urlDownload : urlDownload,
      toTitleCase : toTitleCase,
      //csvToObject : csvToObject,
    };
    return service;

    // Format the API day stats in JS dates format
    // Shift to mid day to avoid BST casting issue
    function toJSDateString(year,month,day) {
      var m = month;
      var d = day;

      if (Number(month) < 10) {
        m = "0"+ month;
      }
      if (Number(day) < 10) {
        d = "0" + day;
      }
      return year + "-" + m + "-" + d + "T12:00:00+00:00";
    }


    function objectToObjectArray(keyname,obj) {
      var mergedArray = [];
      for (var key in obj) {
        var value = obj[key];
        var mergedObj = {};
        mergedObj[keyname] = key;
        mergedArray.push(angular.merge(mergedObj,obj[key]));
      } 
      return mergedArray;
    }
    //
    // Group Time arrays ([[date,value],[date,value],...]) per month or week or day
    //
    function graphGroupBy(dateArray, group){
      
      var groupedData = {};
      var groupedArray = [];
      var ungroupedArray = dateArray.slice(0);

      switch (group) {
        case 'day' :
          //break per day
          //do nothing
          return dateArray;
        case 'month' :
          for (var i=0;i<ungroupedArray.length;i++) {
            var dataPoint = ungroupedArray[i];
            var date = new Date(dataPoint[0]);
            var startOfMonth = date.setUTCDate(1);

            if (groupedData[startOfMonth]) {
              groupedData[startOfMonth] += dataPoint[1];
            } else {
              groupedData[startOfMonth] = dataPoint[1];
            }
          } 
          break;
        case 'week' : 
          for (var i=0;i<ungroupedArray.length;i++) {
            var dataPoint = ungroupedArray[i];
            var date = new Date(dataPoint[0]);
            // Set the date to Monday
            var startOfWeek = date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 6)%7);
            if (groupedData[startOfWeek]) {
              groupedData[startOfWeek] += dataPoint[1];
            } else {
              groupedData[startOfWeek] = dataPoint[1];
            }
          } 
          break;
      }
      //generate the graph output format
      for (var p in groupedData) {
        groupedArray.push([Number(p),groupedData[p]]);
      } 
      return groupedArray;
    }
    // function csvToObject(options){
    //   //const parse = require('csv-parse');
    //   parse(options);
    //   return options;
    // }
    
    function csvDownload(data, fileName,mimeType) {
      if (mimeType) {
        fileType = mimeType;
      } else {
        fileType = 'text/csv'
      }

      var filename = fileName || 'unknown';
      var anchor = angular.element('<a/>');
      anchor.attr({
        href: URL.createObjectURL( new Blob( [data], {type:fileType} )),
        target: '_blank',
        download: filename
      });
      anchor[0].click();
    }
    function toTitleCase(str) {
      if (typeof str === 'string') {
        return str.split('_').join(' ').replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); 
        });
      }
      else return null;
    }
    function urlDownload(url) {

      var anchor = angular.element('<a/>');
      anchor.attr({
        href: url
      });
      anchor[0].click();
    }
  }
]);