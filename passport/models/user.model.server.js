/**
 * Created by Akshay on 3/24/2017.
 */
var mongoose = require('mongoose');
var connectionString = 'mongodb://127.0.0.1:27017/webdev_spring_2017_passportjs';
mongoose.createConnection(connectionString);
var q = require('q');
mongoose.Promise = q.Promise;

var userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String},
    firstName: String,
    email: String,
    role: {type: String, enum: ['STUDENT', 'FACULTY', 'ADMIN', 'USER'], default: 'USER'},
    google: {
        id: String,
        token: String
    }
}, {collection: 'lectures_morning_passportjs_user'});

var userModel = mongoose.model('LecturesMorningPassportJsUser', userSchema);
userModel.createUser = createUser;
userModel.findUserByCredentials = findUserByCredentials;
userModel.findUserById = findUserById;
userModel.findAllUsers = findAllUsers;
userModel.deleteUser = deleteUser;
userModel.updateUser = updateUser;
userModel.findUserByGoogleId = findUserByGoogleId;

module.exports = userModel;

function findUserByGoogleId(googleId) {
    return userModel.findOne({'google.id': googleId});
}

function updateUser(userId, user) {
    return userModel.update(
        {_id: userId},
        {$set: user}
    );
}

function deleteUser(userId) {
    return userModel.remove({_id: userId});
}

function findAllUsers() {
    return userModel.find();
}

function createUser(user) {
    return userModel.create(user);
}

function findUserByCredentials(username, password) {
    return userModel.findOne({username: username, password: password});
}

function findUserById(userId) {
    return userModel.findById(userId);
}

// findUserByCredentials('alice', 'alice');

// createUser({username: 'alice', password: 'alice', firstName: 'Alice'});
// createUser({username: 'bob', password: 'bob', firstName: 'Bob'});
// createUser({username: 'charlie', password: 'charlie', firstName: 'Charlie'});
