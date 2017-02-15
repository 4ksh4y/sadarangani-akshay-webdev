/**
 * Created by Akshay on 2/14/2017.
 */
(function(){
    angular
        .module("WebAppMaker")
        .controller("WebsiteNewController", WebsiteNewController);

    function WebsiteNewController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.createWebsite = createWebsite;

        function init() {
            vm.websites = WebsiteService.findAllWebsitesForUser(vm.userId);
        }
        init();

        function createWebsite (website) {
            WebsiteService.createWebsite(vm.userId, website);
            //vm.websites = WebsiteService.findAllWebsitesForUser(vm.userId);
            $location.url("/user/"+vm.userId+"/website");
        };
    }
})();