/**
 * Created by Akshay on 3/21/2017.
 */

module.exports = function () {
    var model;
    var mongoose = require("mongoose");
    var q = require('q');

    var WidgetSchema = require('./widget.schema.server')();
    var WidgetModel = mongoose.model('WidgetModel', WidgetSchema);
    var fs = require("fs");
    var publicDirectory =__dirname+"/../../../public";

    var api = {
        "createWidget":createWidget,
        "findAllWidgetsForPage":findAllWidgetsForPage,
        "findWidgetById":findWidgetById,
        "updateWidget":updateWidget,
        "deleteWidget":deleteWidget,
        "deleteWidgetOfPage":deleteWidgetOfPage,
        "reorderWidget":reorderWidget,
        "setModel":setModel
    };

    return api;

    function deleteUploadedImage(imageUrl) {
        // Local helper function
        if(imageUrl && imageUrl.search('http') == -1){
            fs.unlink(publicDirectory+imageUrl, function (err) {
                if(err){
                    console.log(err);
                    return;
                }
                console.log('successfully deleted '+ publicDirectory + imageUrl);
            });
        }
    }

    function createWidget(pageId, newWidget) {
        var d = q.defer();
        console.log("attempting to create widget");
        newWidget._page = pageId;
        WidgetModel
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

    function getWidgetsRecursively(count, widgetsOfPage, widgetCollectionForPage) {
        if(count == 0){
            return widgetCollectionForPage;
        }

        return WidgetModel.findById(widgetsOfPage.shift()).select('-__v')
            .then(function (widget) {
                widgetCollectionForPage.push(widget);
                return getWidgetsRecursively(--count, widgetsOfPage, widgetCollectionForPage);
            }, function (err) {
                return err;
            });
    }
    function findAllWidgetsForPage(pageId){
        var d = q.defer();
        WidgetModel
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
        return WidgetModel.findById(widgetId).select('-__v');
    }

    function updateWidget(widgetId, updatedWidget){
        var d = q.defer();
        WidgetModel
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
        // Delete the widget, its reference in the parent page and delete the image
        // associated (if the widget is an IMAGE widget)
        return WidgetModel.findById(widgetId).populate('_page').then(function (widget) {
            widget._page.widgets.splice(widget._page.widgets.indexOf(widgetId),1);
            widget._page.save();
            if(widget.type == "IMAGE"){
                deleteUploadedImage(widget.url);
            }
            return WidgetModel.remove({_id:widgetId});
        }, function (err) {
            return err;
        });
    }

    function deleteWidgetOfPage(widgetId) {
        // Delete the widget and the associated image (if present)
        return WidgetModel.findById(widgetId)
            .then(function (widget) {
                if(widget.type == "IMAGE"){
                    deleteUploadedImage(widget.url);
                }
                return WidgetModel.remove({_id: widgetId});
            }, function (err) {
                return err;
            });
    }

    function reorderWidget(pageId, start, end) {
        return model.pageModel
            .findPageById(pageId)
            .then(function (page) {
                page.widgets.splice(end, 0, page.widgets.splice(start, 1)[0]);
                page.save();
                return 200;
            }, function (err) {
                return err;
            });
    }

    function setModel(_model) {
        model = _model;
    }
};