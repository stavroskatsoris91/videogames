app.controller('emojisCtrl', ['Screen','Emojis','Categories', 'Utils', 'UINotification', '$mdDialog', '$state', '$stateParams', 'UINotification', '$scope',
    function (Screen, Emojis, Categories , Utils, UINotification, $mdDialog, $state, $stateParams, UINotification, $scope) {
        var vm = this;

        vm.updateEmoji = updateEmoji;
        vm.updateImage = updateImage;
        vm.loadImage = loadImage;
        vm.newEmoji = newEmoji;
        vm.updateText = updateText;
        vm.closeDialog = closeDialog;
        vm.showDialog = showDialog;
        vm.deleteEmoji = deleteEmoji;
        vm.deleteDialog = deleteDialog;
        vm.selectedVar = selectedVar;
        vm.changeRank = changeRank;

        var image = {
            image:"",
            image_name:"",
            image_size:"DESKTOP",
            platform_type:"WEB",
        };
        getEmojiList();
        function getEmojiList(){
            Emojis.getList().then(function(res){
                vm.emojis = res;
                vm.ready = true;
                //selectedScreen();
                console.log(res);
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function updateImage(emoji){
            vm.selectedEmoji = emoji;
            document.getElementById('singleImage').click();
        }
        function loadImage(id){
            if(document.getElementById(id).files[0]){
                vm.newImage = document.getElementById(id).files[0];
                uploadImage(vm.selectedEmoji,'image');
            }
        }
        function updateEmoji(emoji,type){
            if(type==='status'){
                emoji.enable=!emoji.enable;
            }
            Emojis.update(emoji).then(function(res){
                for(key in res){
                    emoji[key] = res[key];
                }
                UINotification.success("Emoji updated!");
                document.getElementById('singleImage').value = "";
            }).catch(function(err){
                UINotification.error(err.data.message);
            })
        }
        function uploadImage(){
            var file = image;
            file.emoji_id = vm.selectedEmoji.id;
            file.image_name = vm.newImage.name.slice(0,vm.newImage.name.length - (vm.newImage.name.split('.').slice(-1)[0].length+1));
            file.image = vm.newImage;
            if(vm.selectedEmoji.image){
                Emojis.deleteImage(vm.selectedEmoji).then(function(res){
                    Emojis.createImage(file).then(function(res){
                        for(key in res){
                            vm.selectedEmoji[key] = res[key];
                        }
                        UINotification.success("Emoji Image updated!");
                    document.getElementById('singleImage').value = "";
                    }).catch(function(err){
                        UINotification.error(err.data.message);                
                    })
                }).catch(function(err){
                    UINotification.error(err.data.message);                
                })
            }
            else{
                Emojis.createImage(file).then(function(res){
                    for(key in res){
                        vm.selectedEmoji[key] = res[key];
                    }
                    UINotification.success("Emoji Image created!");
                document.getElementById('singleImage').value = "";
                }).catch(function(err){
                    UINotification.error(err.data.message);                
                })
            }
        }
        function newEmoji(){
            
            showDialog();
        }
        function updateText(){

        }
        function showDialog(emoji){
            if(emoji==='new'){
                vm.selectedEmoji = {
                    enable: false,
                    text: ""
                }
            }else{
                vm.selectedEmoji = emoji;
            }

            $mdDialog.show({
                template:
                    '<md-dialog aria-label="New Emoji">' +
                        '<div layout-padding layout="column">' +
                            '<md-title class="h3">{{vm.selectedEmoji.image?vm.selectedEmoji.image.image_name:"New Emoji"}}</md-title>' +
                                '<md-input-container>'+
                                    '<input mdInput placeholder="Text" ng-model="vm.selectedEmoji.text">'+
                                '</md-input-container>'+
                                '<md-input-container>'+
                                    '<input mdInput placeholder="Rank" type="number" ng-model="vm.selectedEmoji.rank">'+
                                '</md-input-container>'+
                            '<p class="text-right">' +
                                '<button ng-click="vm.updateText(text,image)" class="btn btn-primary">Save</button>  ' +
                                '<button ng-click="vm.closeDialog()" class="btn btn-default">Cancel</button>' +
                            '</p>' +
                        '</div>'+
                    '</md-dialog>',
                scope: $scope,
                preserveScope: true,
            })
        }
        function updateText() {
            if(vm.selectedEmoji.id){
                updateEmoji(vm.selectedEmoji,'text')
                
            }else{
                Emojis.create(vm.selectedEmoji).then(function(res){
                    vm.emojis.push(res);
                    UINotification.success('emoji created');
                    vm.updateImage(res);
                }).catch(function(err){
                    UINotification.error(err.data.message);
                })
            }
            closeDialog();
        }
        function closeDialog() {
            $mdDialog.cancel();
        }
        function deleteDialog(emoji){
            vm.selectedEmoji = emoji;
            $mdDialog.show({
                template:
                    '<md-dialog aria-label="Delete Emoji">' +
                        '<div layout-padding layout="column">' +
                            '<md-title class="h3">Delete {{vm.selectedEmoji.text}}?</md-title>' +
                            '<img  ng-src="{{vm.selectedEmoji.image.image}}" class="w-full">'+
                            '<p class="text-right">' +
                                '<button ng-click="vm.deleteEmoji(vm.selectedEmoji)" class="btn btn-primary">Yes</button>  ' +
                                '<button ng-click="vm.closeDialog()" class="btn btn-default">No</button>' +
                            '</p>' +
                        '</div>'+
                    '</md-dialog>',
                scope: $scope,
                preserveScope: true,
            })
        }
        function deleteEmoji(emoji){
            vm.closeDialog();
            
            if(emoji.image){
                Emojis.deleteImage(emoji).then(function(res){
                    Emojis.deleteEmoji(emoji.id).then(function(res){
                        vm.emojis.map(function(x,index){
                            if(x.id==emoji.id){
                                vm.emojis.splice(index,1);
                            }
                        })
                        UINotification.success("Emoji Deleted");                    
                    }).catch(function(err){
                        UINotification.error(err.data.message);
                    })
                }).catch(function(err){
                    UINotification.error(err.data.message);                
                })
            }
            else{
                Emojis.deleteEmoji(emoji.id).then(function(res){
                    vm.emojis.map(function(x,index){
                        if(x.id==emoji.id){
                            vm.emojis.splice(index,1);
                        }
                    })
                    UINotification.success("Emoji Deleted");                    
                }).catch(function(err){
                    UINotification.error(err.data.message);
                })
            }
        }
        function selectedVar(ev){
            console.log(ev);
        }
        function changeRank(ev){
            console.log(ev);
        }
//         element.on('drop', function(event) {
//             console.log(event);
//             event.preventDefault();
//             var data=event.originalEvent.dataTransfer.getData("Text");                          
//  event.target.parentNode.appendChild(document.getElementById(data));
//       });
    }]);