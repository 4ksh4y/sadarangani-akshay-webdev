/**
 * Created by Akshay on 2/27/2017.
 */

module.exports = function (app) {
    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findAllWidgetsForPage);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);

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

    function findWidgetById(req, res) {
        var widgetId = req.params['widgetId'];
        for(var w in widgets) {
            var widget = widgets[w];
            if(widget._id === widgetId) {
                res.json(widget);
                return;
            }
        }
        return res.sendStatus(404);
    }

    function findAllWidgetsForPage(req, res){
        var pageId = req.params['pageId'];
        var page_widgets = widgets.filter(function (widget) {
            return widget.pageId === pageId;
        });
        res.json(page_widgets);
    }


    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;
        for (var w in widgets) {
            var widget = widgets[w];
            if (widget._id === widgetId) {
                widgets.splice(w, 1);
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }


    function createWidget(req, res) {
        var newWidget= req.body;
        newWidget._id = (new Date()).getTime()+ "";
        widgets.push(newWidget);
        res.json(newWidget);
    }

    function updateWidget(req, res) {
        var widgetId = req.params['widgetId'];
        for (var w in widgets) {
            var widget = widgets[w];
            if (widget._id === widgetId) {
                var newWidget = req.body;
                switch(newWidget.widgetType){
                    case "HEADING":
                        widgets[w].text = newWidget.text;
                        widgets[w].size = newWidget.size;
                        break;
                    case "YOUTUBE":
                    case "IMAGE":
                        widgets[w].url = newWidget.url;
                        widgets[w].width = newWidget.width;
                        break;
                    case "HTML":
                        widgets[w].text = newWidget.text;
                        break;
                    default:
                        return res.sendStatus(404);
                }
                res.sendStatus(200);
                return;
            }
        }
        res.sendStatus(404);
    }
};