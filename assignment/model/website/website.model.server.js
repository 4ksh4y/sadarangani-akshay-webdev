/**
 * Created by Akshay on 3/20/2017.
 */

module.exports = function () {

    var model;
    var mongoose = require('mongoose');
    var q = require('q');

    var websiteSchema = require('./website.schema.server.js')();
    var websiteModel = mongoose.model('WebsiteModel', websiteSchema);

    var api = {
        "setModel": setModel,
        "createWebsiteForUser": createWebsiteForUser,
        "findAllWebsitesForUser": findAllWebsitesForUser,
        "findWebsiteById": findWebsiteById,
        "updateWebsite": updateWebsite,
        "deleteWebsite": deleteWebsite,
        "deleteWebsitePages": deleteWebsitePages,
        "removePage": removePage
    };

    return api;

    function createWebsiteForUser(userId, website) {
        var deferred = q.defer();
        website._user = userId;
        websiteModel.create(website, function (err, w) {
            if (err) {
                deferred.reject(err);
            } else {
                addWebsite(userId, w);
                deferred.resolve(w);
            }
        });

        return deferred.promise;
    }

    function addWebsite(userId, website) {
        var deferred = q.defer();
        model.userModel
            .findUserById(userId)
            .then(function(user) {
                user.websites.push(website);
                user.save();
                deferred.resolve(user);
            }, function (err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    function findAllWebsitesForUser(userId) {
        var d = q.defer();
        websiteModel
            .find({"_user": userId}, function (err, websites) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(websites);
                }
            });
        return d.promise;
    }

    function findWebsiteById(websiteId) {
        var d = q.defer();
        websiteModel
            .find({"_id": websiteId}, function (err, website) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(website);
                }
            });
        return d.promise;
    }

    function updateWebsite(websiteId, website) {
        var d = q.defer();
        websiteModel
            .findOneAndUpdate({"_id": websiteId}, {$set: website}, function (err, updatedWebsite) {
                if (err) {
                    d.reject(err);
                } else {
                    d.resolve(updatedWebsite);
                }
            });
        return d.promise;
    }

    function deleteWebsite(websiteId) {
        var deferred = q.defer();
        findWebsiteById(websiteId)
            .then(function (w) {
                deleteWebsitePages(websiteId)
                    .then(function() {
                        model.userModel
                            .removeWebsite(w)
                            .then(function() {
                                console.log("the actual websit e removal");
                                websiteModel
                                    .remove({"_id": websiteId}, function (err, status) {
                                        if (err) {
                                            deferred.abort(err);
                                        } else {
                                            deferred.resolve(status);
                                        }
                                    });
                    }, function(err) {
                                deferred.reject(err);
                        });

                    }, function (err) {
                        deferred.reject(err);
                    });

            }, function(err) {
                deferred.reject(err);
            });

        return deferred.promise;
    }

    function setModel(_model) {
        model = _model;
    }

    function deleteWebsitePages(websiteId) {
        console.log("inside delete website pages");
        var deferred = q.defer();
        model.pageModel
            .findAllPagesForWebsite(websiteId)
            .then(function (pages) {
                console.log(pages);
                for(var p in pages) {
                    model.pageModel
                        .deletePage(pages[p]._id);
                }
                console.log("deleted website pages");
                deferred.resolve();
            }, function (err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    function removePage(page) {
        var deferred = q.defer();
        console.log("inside reove page");
        findWebsiteById(page[0]._website)
            .then(function(website) {
                console.log("remove found page")
                website[0].pages.pull(page[0]);
                website[0].save();
                deferred.resolve();
            },function(err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }
};