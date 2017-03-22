/**
 * Created by Akshay on 3/3/2017.
 */
module.exports = function () {

    var model;
    var mongoose = require('mongoose');
    var q = require('q');
    var userSchema = require('./user.schema.server.js')();
    var userModel = mongoose.model('UserModel', userSchema);

    var api = {
        "setModel": setModel,
        "createUser": createUser,
        "findUserById": findUserById,
        "findUserByUsername": findUserByUsername,
        "findUserByCredentials": findUserByCredentials,
        "updateUser": updateUser,
        "deleteUser": deleteUser,
        "removeWebsite": removeWebsite
    };

    return api;



    function createUser(user) {
        var deferred = q.defer();
        userModel.create(user, function(err, u) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(u);
            }
        });
        return deferred.promise;
    }

    function updateUser(userId, user) {
        var d = q.defer();
        userModel
            .findOneAndUpdate({"_id": userId}, {$set: user}, function (err, updatedUser) {
                if(err) {
                    d.reject();
                } else {
                    d.resolve(updatedUser);
                }
            });

        return d.promise;
    }

    function deleteUser(userId) {
        var deferred = q.defer();

        deleteWebsitesForUser(userId)
            .then(function(userId) {
                console.log("removing user");
                userModel
                    .remove({_id: userId}, function (err, status) {
                        if(err) {
                            deferred.reject(err);
                        } else {
                            deferred.resolve(status);
                        }
                    });
            }, function (err) {
                deferred.reject(err);
            });

        return deferred.promise;
    }

    function removeWebsite(website) {
        console.log("attempt to remove website from user profile");
        var deferred = q.defer();
        findUserById(website[0]._user)
            .then(function(user) {
                //console.log(user);
               // console.log(website);
                user.websites.pull(website[0]);
                user.save();
                console.log("removed website from user profile");
                deferred.resolve();
            },function(err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    function deleteWebsitesForUser(userId) {
        var deferred = q.defer();
        console.log("inside deletewebsitesforuser");
        model.websiteModel
            .findAllWebsitesForUser(userId)
            .then(function (websites) {
                for(var w in websites) {
                    model.websiteModel
                        .deleteWebsite(websites[w]._id);
                }
                deferred.resolve(userId);
            }, function(err) {
                deferred.reject(err);
            });

        return deferred.promise;
    }


    function findUserById(userId) {
        var d = q.defer();
        userModel
            .findById(userId, function (err, user) {
                if(err) {
                    d.reject(err);
                } else {
                    d.resolve(user);
                }
            });

        return d.promise;
    }

    function findUserByUsername(username) {
        var d = q.defer();

        userModel
            .find({"username": username}, function (err, user) {
                if(err) {
                    d.reject(err);
                } else {
                    d.resolve(user);
                }
            });

        return d.promise;
    }

    function findUserByCredentials(username, password) {
        var d = q.defer();

        userModel
            .find({"username": username, "password": password}, function (err, user) {
                if(err) {
                    d.reject(err);
                } else {
                    d.resolve(user);
                }
            });

        return d.promise;
    }

    function setModel(_model) {
        model = _model;
    }

};