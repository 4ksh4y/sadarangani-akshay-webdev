/**
 * Created by Akshay on 1/31/2017.
 */
(function () {
    angular
        .module("WebAppMaker")
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider
            .when("/login", {
                templateURL : 'user'
            })
    }
})();