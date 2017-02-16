(function () {
    angular
        .module("WebAppMaker")
        .service("WidgetService", WidgetService);
    
    function WidgetService() {
        var widgets = [
            { "_id": "123", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO"},
            { "_id": "234", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
            { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
                "url": "https://images.unsplash.com/photo-1469573054742-64da3f2527fc?" +
                "dpr=1.25&auto=format&fit=crop&w=1500&h=1199&q=80&cs=tinysrgb&crop="},
            { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum para</p>"},
            { "_id": "567", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
            { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
                "url": "https://youtu.be/7HBux5Ke13M" },
            { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
            ];

        var api = {
            "createWidget": createWidget,
            "findWidgetsByPageId": findWidgetsByPageId,
            "findWidgetById": findWidgetById,
            "updateWidget": updateWidget,
            "deleteWidget": deleteWidget

        };

        return api;

        function findWidgetsByPageId(pageId) {
            var user_widgets = [];
            for (var w in widgets) {
                if (widgets[w].pageId === pageId) {
                    user_widgets.push(angular.copy(widgets[w]));
                }
            }
            return user_widgets;
        }

        function deleteWidget(widgetId) {
            for(var w in widgets) {
                if(widgets[w]._id === widgetId) {
                    widgets.splice(w, 1);
                    return true;
                }
            }
        }

        function createWidget(pageId, widget) {
            widget.pageId = pageId;
            widget._id = (new Date()).getTime();
            widgets.push(widget);
        }

        function updateWidget(widgetId, widget) {
            for(var w in widgets) {
                if( widgets[w]._id === widgetId) {
                    if(widget.text)
                        widgets[w].text = widget.text;
                    if(widget.size) {
                        widgets[w].size = widget.size;
                    }
                    if(widget.url)
                        widgets[w].url = widget.url;
                    if(widget.width)
                        widgets[w].width = widget.width;
                    return widgets[w];
                }
            }
            return null;
        }

        function findWidgetById(widgetId) {
            for(var w in widgets) {
                if(widgets[w]._id === widgetId) {
                    return angular.copy(widgets[w]);
                }
            }
            return null;
        }
    }
})();