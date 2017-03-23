/**
 * Created by Akshay on 3/21/2017.
 */

module.exports = function () {
    var model;
    var mongoose = require("mongoose");
    var q = require('q');

    var widgetSchema = require('./widget.schema.server')();
    var widgetModel = mongoose.model('widgetModel', widgetSchema);
    var fs = require("fs");
    var publicDirectory =__dirname+"/../../../public";

    var api = {
        "createWidget":createWidget,
        "findAllWidgetsForPage":findAllWidgetsForPage,
        "findWidgetById":findWidgetById,
        "updateWidget":updateWidget,
        "deleteWidget":deleteWidget,
        "reorderWidget":reorderWidget,
        "setModel":setModel
    };

    return api;


    function createWidget(pageId, newWidget) {
        var d = q.defer();
        console.log("attempting to create widget");
        newWidget._page = pageId;
        widgetModel
            .create(newWidget, function (err, w) {
                if (err) {
                    d.reject(err);
                } else {
                    console.log("created widget");
                    model.pageModel
                        .findPageById(pageId)
                        .then(function (page) {
                            page[0].widgets.push(w._id);
                            page[0].save();
                            console.log("widget added to pages array");
                            d.resolve(w);
                        }, function (err) {
                            d.reject(err);
                        });
                }
            });
        return d.promise;
    }

    function findAllWidgetsForPage(pageId){
        var d = q.defer();
        widgetModel
            .find({"_page": pageId}, function (err, widgets) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(widgets);
                }
            });
        return d.promise;
    }

    function findWidgetById(widgetId){
        var d = q.defer();
        widgetModel
            .findById(widgetId)
            .then(function(widget) {
                d.resolve(widget);
            }, function(err) {
                d.reject(err);
            });
        return d.promise;
    }

    function updateWidget(widgetId, updatedWidget){
        var d = q.defer();
        widgetModel
            .findOneAndUpdate({_id: widgetId}, {$set: updatedWidget}, function (err, updatedWidget) {
                if (err) {
                    console.log("error in model");
                    d.reject(err);
                } else {
                    console.log("model updated widget successfully");
                    d.resolve(updatedWidget);
                }
            });
        return d.promise;
    }
    function deleteWidget(widgetId){
        var d = q.defer();
        widgetModel
            .findById(widgetId).populate('_page')
            .then(function (widget) {
                console.log("widget found with _page "+widget+"\n"+"widget_page");
                widget._page.widgets.splice(widget._page.widgets.indexOf(widgetId),1);
                widget._page.save();
                if(widget.type == "IMAGE"){
                    deleteUploadedImage(widget.url);
                }
                console.log("widget spliced successfully");
                widgetModel
                    .remove({_id:widgetId})
                    .then(function() {
                        d.resolve();
                    }, function (err) {
                        d.reject(err);
                    });
        }, function (err) {
            d.reject(err);
        });
        return d.promise;
    }

    function deleteUploadedImage(imageUrl) {
        // Local helper function
        if(imageUrl && imageUrl.search('http') == -1){
            fs.unlink(publicDirectory+imageUrl, function (err) {
                if(err){
                    console.log(err);
                    return;
                }
            });
        }
    }

    function reorderWidget(pageId, start, end) {
        var d = q.defer();
        model.pageModel
            .findPageById(pageId)
            .then(function (page) {
                page.widgets.splice(end, 0, page.widgets.splice(start, 1)[0]);
                page.save();
                d.resolve();
            }, function (err) {
                d.reject(err);
            });
        return d.promise;
    }

    function setModel(_model) {
        model = _model;
    }
};