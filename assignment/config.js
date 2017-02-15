(function () {
    angular
        .module("WebAppMaker")
        .config(configuration);
    
    function configuration($routeProvider) {
        $routeProvider
            .when("/login",{
                templateUrl: 'views/user/login.view.client.html',
                controller: 'loginController',
                controllerAs: 'loginController'
            })
            .when("/register",{
                templateUrl: 'views/user/register.view.client.html'
            })
            .when("/profile", {
                templateURL: 'views/user/profile.view.client.html'
            })
    }
})();