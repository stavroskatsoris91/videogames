'use strict';
angular.module('videogamesApp')
    .directive('hero', function () {
        return {
            scope: {},
            bindToController: {},
            restrict: 'E',
            templateUrl: '/views/hero.html',
            replace: true,
            controllerAs: 'Ctrl',
            controller: function ($window, $rootScope, $timeout, $element,$interval) {
                var Ctrl = this;
                Ctrl.idle = 0;
                var list = [
                    {
                        width: 562,
                        height: 519,
                        count: 10
                    },
                    {
                        width: 567,
                        height: 556,
                        count: 10
                    },
                    {
                        width: 567,
                        height: 556,
                        count: 10
                    },
                    {
                        width: 567,
                        height: 556,
                        count: 8
                    },
                    {
                        width: 567,
                        height: 556,
                        count: 8
                    },
                    {
                        width: 567,
                        height: 556,
                        count: 8
                    },
                    {
                        width: 567,
                        height: 556,
                        count: 4
                    },
                    {
                        width: 566,
                        height: 556,
                        count: 10
                    }
                ];
                var i = 1; //idle
                //var i = 5; //run
                var frame = 0,
                    speed = 0,
                    y = 0,
                    left = 0,
                    jumpTriggerd = false,
                    jumpFrame = 0,
                    gravity = 1,
                    gravitySpeed = 0,
                    x=-300,
                    bottom = 121,
                    jumpForce = 15,
                    onGround = true,
                    top = 0;
                Ctrl.direction = 1;

                function heroAnimation() {
                    $interval(function () {
                        updateHero(new Date().getTime());
                        heroFrame(new Date().getTime());
                        //y = Math.max(0,Math.min(y,$window.innerWidth));
                        //heroAnimation();

                        //heroAnimation(time);
                    }, 60);

                }

                function updateHero() {
                    
                    var heroOffset = $element.find('.hero:not(.copy)')[0].offsetLeft;
                    if (heroOffset > $window.innerWidth) {
                        y = heroOffset - $window.innerWidth;
                        Ctrl.first = !Ctrl.first;

                    }
                    else if (heroOffset < 0) {
                        y = heroOffset + $window.innerWidth;
                        Ctrl.first = !Ctrl.first;

                    }
                    Ctrl.copyLeft = (y > $window.innerWidth / 2)?-1:1;
                    y += Ctrl.direction * speed;
                    gravitySpeed +=gravity;
                    if(jumpTriggerd&&onGround){
                        gravitySpeed = -jumpForce;
                        jumpTriggerd = false;
                    }
                    jumpTriggerd = false;
                    x += gravitySpeed;
                    if(x>bottom){
                        x = bottom;
                        gravitySpeed = 0;
                        onGround = true;
                    }else{
                        onGround = false;
                    }
                    $element.find('.hero:not(.copy)').css({'left':y+'px','top':x});
                    $element.find('.hero.copy').css({'left': Ctrl.copyLeft*$window.innerWidth+y+'px','top':x});
                }
                function heroFrame(time) {
                    // if(jumpTriggerd){
                    //     //onGround = false;
                    //     jumpTriggerd = false;
                    // }
                    if(onGround){
                        frame++;
                        if (speed) {
                            i = 5;
                        } else {
                            i = 1;
                        }
                        if (frame >= list[i].count) {
                            frame = 0;
                            //i = i >= list.length - 1 ? 0 : i + 1;
                        }
                        
                    }else{
                        if(i!=2){
                            i = 2;
                            frame = 0;
                            jumpFrame = time;
                        }
                        else{
                            if(jumpFrame<time-200&&frame<list[i].count-1){
                                jumpFrame = time;
                                frame++;
                            }
                        }


                    }
                    left = list[i].width * frame;
                        top = 0;
                        for (var j = 0; j < i; j++) {
                            top += list[j].height;
                        }
                }
                // $rootScope.$on('keydown',function(event,data){

                //     if(data.key=='left'||data.key=='right'){
                //         Ctrl.direction = -1;
                //         run = true;
                //         Ctrl.direction = data.key=='right'?1:-1;
                //     }
                // });
                $rootScope.$on('keyup', function (event, data) {
                    if (data.key === 'left' || data.key === 'right') {
                        speed = 0;
                    }
                    if(data.key=='up'){
                        //jumpTriggerd = false;
                        // onGround = true;
                    }
                });
                $rootScope.$on('keypress', function (event, data) {

                    if (data.key === 'left' || data.key === 'right') {
                        Ctrl.direction = data.key === 'right' ? 1 : -1;
                        speed = 20;
                    }
                    if(data.key=='up'){
                        jumpTriggerd = true;
                        // onGround = false;
                    }
                });
                // Ctrl.move = function () {

                //     return { 'left': y + 'px' };
                // };
                Ctrl.animation = function () {
                    return {
                        left: -left + 'px',
                        top: -top + 'px'
                    };
                };
                heroAnimation();
            },
        };
    });
