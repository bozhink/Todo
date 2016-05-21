var uuid = require('uuid');

require('../polyfills/array');

function EventDAO(db) {
    'use strict';

    var usersCollection = db('users');

    function getEvents(user, callback) {
        var events = [],
            now = new Date(),
            indicesToRemove = [];

        if (!user) {
            callback('Not authorized User', events);
            return;
        }

        user.events = user.events || [];
        user.events.forEach(function (event, index) {
            var date = new Date(event.date);
            if (date - now <= 0) {
                indicesToRemove.push(index);
            }
        });

        indicesToRemove.forEach((indexToRemove) => user.events.splice(indexToRemove, 1));

        user.events.sort((e1, e2) => new Date(e1.date) - new Date(e2.date));

        events = user.events || [];
        events = events.map(function (dbEvent) {
            var creator = usersCollection.find({
                    id: dbEvent.creatorId
                }),
                users = dbEvent.users.map(function (userId) {
                    var username = usersCollection.find({
                        id: userId
                    });

                    return {
                        id: userId,
                        username: username
                    };
                });

            var event = {
                id: dbEvent.id,
                title: dbEvent.title,
                category: dbEvent.category,
                description: dbEvent.description,
                date: dbEvent.date,
                creator: creator.username,
                users: users
            };

            return event;
        });

        callback(null, events);
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
            id: uuid(),
            title: event.title,
            category: event.category || 'uncategorized',
            description: event.description,
            date: event.date,
            creatorId: user.id
        };

        event.usersUsernames = event.usersUsernames || [];

        users = event.usersUsernames.map(function (username) {
            return usersCollection.find({
                usernameLower: username.toLowerCase()
            });
        }).filter((user) => !!user);

        if (users.length !== event.usersUsernames.length) {
            callback('Invalid users added', null);
            return;
        }

        // Add user to users if not present
        if (!users.find((u) => u.id === user.id)) {
            users.push(user);
        }

        dbEvent.users = users.map((user) => user.id);

        users.forEach(function (user) {
            user.events = user.events || [];
            user.events.push(dbEvent);
        });

        db.write();

        callback(null, event);
    }

    return {
        getEvents,
        addEvent
    };
}

module.exports.EventDAO = EventDAO;
