var uuid = require('uuid');

require('../polyfills/array');

function EventDAO(db) {
    'use strict';

    var usersCollection = db.collection('users'),
        eventsCollection = db.collection('events');

    function mapEventToResponseModel(event) {
        return {
            id: event._id.toString(),
            title: event.title,
            category: event.category,
            description: event.description,
            date: event.date,
        };
    }

    function getEvents(user, callback) {
        var now = new Date();

        if (!user) {
            callback('Not authorized User', null);
            return;
        }

        eventsCollection
            .find({
                'users': user._id.toString(),
                'date': {
                    '$gte': now
                }
            })
            .toArray(function(err, events) {
                events = events || [];
                callback(err, events.map(mapEventToResponseModel));
            });
    }

    function addEvent(user, event, callback) {
        var dbEvent, users;
        if (!user) {
            callback('Not authorized User', null);
            return;
        }

        if (!event) {
            callback('Cannot add null event', null);
            return;
        }

        dbEvent = {
            title: event.title,
            category: event.category || 'uncategorized',
            description: event.description,
            date: event.date,
            creatorId: user._id.toString()
        };

        event.usersUsernames = event.usersUsernames || [];

        usersCollection
            .find({
                'usernameLower': {
                    '$in': event.usersUsernames
                }
            })
            .toArray(function (err, users) {
                users = users || [];
                if (users.length !== event.usersUsernames.length) {
                    callback('Invalid users added', null);
                    return;
                }

                // Add user to users if not present
                if (!users.find((u) => u._id.toString() === user._id.toString())) {
                    users.push(user);
                }

                dbEvent.users = users.map((u) => u._id.toString());

                eventsCollection.insert(dbEvent, {
                    w: 1
                }, function(err, result) {
                    callback(err, mapEventToResponseModel(dbEvent));
                })
            });
    }

    return {
        getEvents,
        addEvent
    };
}

module.exports.EventDAO = EventDAO;