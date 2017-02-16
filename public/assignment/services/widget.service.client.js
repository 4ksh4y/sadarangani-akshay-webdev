(function () {
    angular
        .module("WebAppMaker")
        .service("WidgetService", WidgetService);
    
    function WidgetService() {
        var widgets = [
            { "_id": "123", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO"},
            { "_id": "234", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
            { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
                "url": "http://lorempixel.com/400/200/"},
            { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum para</p>"},
            { "_id": "567", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
            { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
                "url": "https://youtu.be/AM2Ivdi9c4E" },
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
                    widgets[w].text = widget.text;
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