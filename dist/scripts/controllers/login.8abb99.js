app.controller('loginCtrl', ['User','$mdDialog','$state','$stateParams', '$rootScope','$location',
                    function(User,$mdDialog,$state,$stateParams,$rootScope,$location) {
    var vm = this;

    vm.login = login;

    init();

    function init () {

    }

    function login() {
        
        User.login(vm.email, vm.password).then(function(res) {
            if ($rootScope.redirectAfterLogin) {
                $location.path($rootScope.redirectAfterLogin)
            } else {
                $state.transitionTo('app.dashboard');
            }
        }).catch(function(err){
            console.log("Error",err);
            $mdDialog.show(
                $mdDialog.alert()
                    .title('Login failed')
                    .content('Your username and/or password are incorrect')
                    .ok('Try again')
            );
        });
    }
}]);