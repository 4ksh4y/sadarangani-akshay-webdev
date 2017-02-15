/**
 * Created by Akshay on 2/15/2017.
 */
(function(){
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("PageNewController", PageNewController)
        .controller("PageEditController", PageEditController);

    function PageListController($routeParams, PageService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        function init() {
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
        }
        init();
    }

    function PageNewController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.createPage = createPage;

        function init() {
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
        }
        init();
        console.log(vm.pages);

        function createPage (page) {
            if(page.name == "" || page.name == null || page.description == "" || page.description == null){
                vm.error = "Please fill all details";
                return;
            }
            var res = PageService.createPage(vm.websiteId, page);
            if(res != null){
                $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page");
            }
            vm.error = "An error has occurred.";
        }
    }

    function PageEditController($routeParams, $location, PageService) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.deletePage = deletePage;

        function init() {
            vm.pages = PageService.findPageByWebsiteId(vm.websiteId);
        }
        init();

        function deletePage () {
            PageService.deletePage(vm.pageId);
            $location.url("/user/"+vm.userId+"/website");
        }
    }
})();