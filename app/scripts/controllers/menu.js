app.controller('MenuCtrl', ['User','$state','$rootScope', 
                    function(User,$state,$rootScope) {
    var vm = this;

    vm.logout = logout;

    init();

    function init () {
        User.getUser().then(function(res){
            $rootScope.admin = res;
            vm.email = res.contact.email;
            vm.name = res.contact.firstname + " " + res.contact.surname;
            if (res.public_profile.profile_picture) {
                vm.profilePicture = res.public_profile.profile_picture.medium;
            } else {
                vm.profilePicture = "images/a0.jpg";
            }
        }).catch(function(err){
            console.log("Error is",err);
        })
    }

    function logout() {
        User.logout();
        $state.transitionTo("access.signin",{},{reload: true});
    }
}]);