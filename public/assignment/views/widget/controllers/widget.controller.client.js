(function(){
    angular
        .module("WebAppMaker")
        .controller("WidgetListController", WidgetListController)
        .controller("WidgetNewController", WidgetNewController)
        .controller("WidgetEditController", WidgetEditController);

    function WidgetListController($routeParams, WidgetService, $sce) {
        var vm = this;
        vm.getYouTubeEmbedUrl = getYouTubeEmbedUrl;
        vm.getTrustedHtml = getTrustedHtml;
        vm.getWidgetTemplateUrl = getWidgetTemplateUrl;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        function init(){
            WidgetService
                .findAllWidgetsForPage(vm.pageId)
                .success(function (response) {
                    vm.widgets = response;
                });
        }
        init();

        function getWidgetTemplateUrl(widgetType) {
            var url = 'views/widget/templates/widget-' + widgetType + '.view.client.html';
            return url;
        }

        function getTrustedHtml(html) {
            return $sce.trustAsHtml(html);
        }

        function getYouTubeEmbedUrl(widgetUrl) {
            var urlParts = widgetUrl.split('/');
            var id = urlParts[urlParts.length - 1];
            var url = "https://www.youtube.com/embed/" + id;
            return $sce.trustAsResourceUrl(url);
        }
    }

    function WidgetEditController($routeParams, WidgetService,$location) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.widgetId = $routeParams.wgid;
        vm.getEditorTemplateUrl = getEditorTemplateUrl;
        vm.updateWidget = updateWidget;
        vm.deleteWidget = deleteWidget;
        function init() {
            WidgetService
                .findWidgetById(vm.widgetId)
                .success(function(response) {
                    vm.widget=response;
                })
                .error(function(){
                    vm.error = "An error occured";
                });
        }
        init();
        //console.log(vm.widget);

        function getEditorTemplateUrl(type) {
            return 'views/widget/templates/editors/widget-' + type + '-editor.view.client.html';
        }

        function deleteWidget () {
            WidgetService
                .deleteWidget(vm.widgetId)
                .success(function(){
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
                })
                .error(function () {
                    vm.error = "Unable to delete website";
                });

        }

        function updateWidget(_widget) {
            /*if(_widget.type == "HEADING") {
                _widget.size = widget.size;
                _widget.text = widget.text;
            }
            if(_widget.type == "IMAGE") {
                _widget.width = widget.width;
                _widget.url = _widget.url;
            }*/
            WidgetService
                .updateWidget(vm.widgetId, _widget)
                .success(function () {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget");
                })
                .error(function () {
                    vm.error = "Unable to update widget";
                });
        }
    }

    function WidgetNewController($routeParams, WidgetService, $location) {
        var vm = this;
        vm.userId = $routeParams.uid;
        vm.websiteId = $routeParams.wid;
        vm.pageId = $routeParams.pid;
        vm.createHeadingWidget = createHeadingWidget;
        vm.createMediaWidget = createMediaWidget;
        vm.getEditorTemplateUrl = getEditorTemplateUrl;

        function createMediaWidget(type) {
            var newWidget = {
                widgetType: type,
                pageId: vm.pageId,
                url: "http://",
                width: "100%"
            };
            WidgetService
                .createWidget(vm.pageId, newWidget)
                .success(function (widget) {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+widget._id);
                })
                .error(function () {
                    vm.error = "Could not create widget";
                });
        }

        function createHeadingWidget() {
            console.log("in createHeading");
            var newWidget = {
                widgetType: "HEADING",
                pageId: vm.pageId,
                text: "New Heading",
                size: 1
            };
            WidgetService
                .createWidget(vm.pageId, newWidget)
                .success(function (widget) {
                    $location.url("/user/"+vm.userId+"/website/"+vm.websiteId+"/page/"+vm.pageId+"/widget/"+widget._id);
                })
                .error(function () {
                   vm.error = "Could not create widget";
                });
        }

        function getEditorTemplateUrl(type) {
            return 'views/widget/templates/creators/widget-' + type + '-editor.view.client.html';
        }
    }
})();