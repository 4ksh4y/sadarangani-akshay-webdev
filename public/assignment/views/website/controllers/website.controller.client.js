/**
 * Created by Akshay on 2/15/2017.
 */
(function(){
    angular
        .module("WebAppMaker")
        .controller("WebsiteListController", WebsiteListController)
        .controller("WebsiteNewController", WebsiteNewController)
        .controller("WebsiteEditController", WebsiteEditController);

    function WebsiteListController($routeParams, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        function init() {
            vm.websites = WebsiteService.findWebsiteByUser(vm.userId);
        }
        init();
    }

    function WebsiteNewController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.createWebsite = createWebsite;

        function init() {
            vm.websites = WebsiteService.findWebsiteByUser(vm.userId);
        }
        init();

        function createWebsite (website) {
            if(website == null || website.name == "" || website.name == null || website.description == "" || website.description == null){
                vm.error = "Please fill all details";
                return;
            }
            var res = WebsiteService.createWebsite(vm.userId, website);
            if(res != null){
                $location.url("/user/"+vm.userId+"/website");
            }
            vm.error = "An error has occurred.";
        }
    }

    function WebsiteEditController($routeParams, $location, WebsiteService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.updateWebsite = updateWebsite;
        vm.deleteWebsite = deleteWebsite;

        var website = WebsiteService.findWebsiteById(vm.websiteId);
        vm.website = website;
        console.log(vm.website);
        function init() {
            vm.websites = WebsiteService.findWebsiteByUser(vm.userId);
        }
        init();

        function updateWebsite (websiteId, website) {
            var site = WebsiteService.updateWebsite(websiteId, website);
            if(site == null) {
                vm.error = "Unable to update website";
            } else {
                vm.message = "Website successfully updated"
            }
        }

        function deleteWebsite () {
            WebsiteService.deleteWebsite(vm.websiteId);
            $location.url("/user/"+vm.userId+"/website");
            vm.error = "Unable to delete website";
        }
    }
})();