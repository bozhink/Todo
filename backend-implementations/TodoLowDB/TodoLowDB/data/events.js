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
        user.events.forEach(function(event, index) {
            var date = new Date(event.date);
            if (date - now <= 0) {
                indicesToRemove.push(index);
            }
        });

        indicesToRemove.forEach((indexToRemove) => user.events.splice(indexToRemove, 1));

        user.events.sort((e1, e2) => new Date(e1.date) - new Date(e2.date));

        events = user.events || [];
        events = events.map(function(dbEvent) {
            var creator = usersCollection.find({
                    id: dbEvent.creatorId
                }),
                users = dbEvent.users.map(function(userId) {
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
    
    return {
        getEvents
    };
}

module.exports.EventDAO = EventDAO;
