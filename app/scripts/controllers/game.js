'use strict';
angular.module('videogamesApp')
  .controller('GameCtrl', function ($scope) {
    var Ctrl = this;
    Ctrl.text = 'Game1';
    Ctrl.images = [
      {
        img: '/images/number1.jpg',
        caption: 'image1'
      },
      {
        img: '/images/number2.jpg',
        caption: 'image2'
      },
      {
        img: '/images/number3.jpg',
        caption: 'image3'
      },
      {
        img: '/images/number4.jpg',
        caption: 'image4'
      }
    ];
    $scope.Math = window.Math;
  });
