app.controller('artworkListCtrl', ['Artwork','$mdDialog','$state','$stateParams', '$scope',
                    function(Artwork,$mdDialog,$state,$stateParams,$scope) {
    var vm = this;

    vm.delete = function (id) {

    Artwork.deleteTemplate(id).then(function(res){
        console.log("Done",res);
      }).catch(function(err){
        console.log("Error",err);
      })  
    }
    vm.update = function (template) {

      Artwork.update(template).then(function(res){
        console.log("Done",res);
      }).catch(function(err){
        console.log("Error",err);
      })  
    }
    
    Artwork.getAll().then(function(res){
      vm.artworkList = res;
      console.log("ArtworkList",res);
    }).catch(function(err){

    });
  }
]);