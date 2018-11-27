'use strict';
angular.module('videogamesApp').directive('myCanvas', function () {
    return {
        scope: {},
        bindToController: {},
        restrict: 'A',
        controllerAs: 'Ctrl',
        controller: function ($scope, $location, $element) {
            var Ctrl = this;
            var c = $element[0];
            var ctx = c.getContext('2d');
            ctx.beginPath();
            ctx.arc(95, 50, 40, 0, 2 * Math.PI);
            ctx.stroke();
            window.requestAnimFrame = (function () {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                    function () {

                        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                            function (callback) {
                                window.setTimeout(callback, 1000 / 60);
                            };
                    };
            })();

            function drawRectangle(myRectangle, ctx) {
                ctx.beginPath();
                ctx.rect(myRectangle.x, myRectangle.y, myRectangle.width, myRectangle.height);
                ctx.fillStyle = '#8ED6FF';
                ctx.fill();
                ctx.lineWidth = myRectangle.borderWidth;
                ctx.strokeStyle = 'black';
                ctx.stroke();
            }
            function animate(myRectangle, c, ctx, startTime) {

                // update
                startTime = Ctrl.startTime;
                var time = (new Date()).getTime() - startTime;

                var linearSpeed = 100;
                // pixels / second
                var newX = linearSpeed * time / 1000;

                if (newX < c.width - myRectangle.width - myRectangle.borderWidth / 2) {
                    myRectangle.x = newX;
                } else {
                    myRectangle.x = 0;
                    Ctrl.startTime = new Date().getTime();
                }

                // clear
                ctx.clearRect(0, 0, c.width, c.height);

                drawRectangle(myRectangle, ctx);

                // request new frame
                window.requestAnimFrame(function () {
                    animate(myRectangle, c, ctx, startTime);
                });
            }

            c.onclick = function (e) {

                /// adjust mouse position to be relative to c
                var rect = c.getBoundingClientRect(),
                    x = e.clientX - rect.left,
                    y = e.clientY - rect.top;

                /// grab a pixel
                // var data = ctx.getImageData(x, y, 1, 1).data;

                // /// check it's alpha value to see if we're in a map point
                // /// this of course assumes the map has transparent areas.
                // /// if not just check for the color values instead.
                // if (data[3] > 0) 
                myRectangle.x = x;
                Ctrl.startTime = new Date().getTime() - myRectangle.x * 10;
                myRectangle.y = y;
                //window.alert(x+','+y);
            };
            var myRectangle = {
                x: 0,
                y: 75,
                width: 100,
                height: 50,
                borderWidth: 5
            };

            drawRectangle(myRectangle, ctx);
            // wait one second before starting animation
            //$timeout(function () {
            Ctrl.startTime = (new Date()).getTime();
            animate(myRectangle, c, ctx, Ctrl.startTime);
            //}, 1000);

        }
    };
});