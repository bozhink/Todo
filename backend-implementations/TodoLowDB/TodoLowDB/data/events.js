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
            callback(events, 'Not authorized User');
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
                    'id': dbEvent.creatorId
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

        callback(events);
    }

    function addEvent(user, title, category, description, date, usersUsernames, callback) {
        var event, users;
        if (!user) {
            callback(null, 'Not authorized User.');
            return;
        }

        users = usersUsernames.map(function (username) {
            return usersCollection.find({
                usernameLower: username.toLowerCase()
            });
        }).filter((user) => !!user);

        if (users.length !== usersUsernames.length) {
            callback(null, 'Invalid users added');
            return;
        }

        users.push(user);
        user.events = user.events || [];

        event = {
            id: uuid(),
            title: title,
            category: category || 'uncategorized',
            description: description,
            date: date,
            creatorId: user.id,
            users: users.map((user) => user.id)
        };

        users.forEach(function (user) {
            user.events = user.events || [];
            user.events.push(event);
        });

        callback(event);
    }

    return {
        getEvents,
        addEvent
    };
}

module.exports.EventDAO = EventDAO;
