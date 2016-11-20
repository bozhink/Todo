var mongoose = require('mongoose'),
    UserSchema = require('../schemas/userSchema');

module.exports = function (db) {
    var schema = new mongoose.Schema(new UserSchema());

    schema.virtual('fullname').get(function () {
        return this.profie.firstname + ' ' + this.profile.lastname;
    });

    schema.set('toObject', {
        virtuals: true
    });

    schema.set('toJSON', {
        virtuals: true
    });

    return db.model('User', schema, 'users');
};