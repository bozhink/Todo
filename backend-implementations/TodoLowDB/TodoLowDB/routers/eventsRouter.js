var express = require('express'),
    uuid = require('uuid'),
    EventDAO = require('../data/events').EventDAO;

require('../polyfills/array');

module.exports = function (db) {
    'use strict';

    var router = express.Router(),
        usersCollection = db('users'),
        events = new EventDAO(db);

    router
        .get('/', function (req, res) {
            var user = req.user;

            if (!user) {
                res.status(401)
                    .json('Not authorized User');
                return;
            }

            events.getEvents(user, function (events) {
                res.json({
                    result: events
                });
            });
        })
        .post('/', function (req, res) {
            var event, usersUsernames, users, user = req.user;
            if (!user) {
                res.status(401)
                    .json('Not authorized User');
                return;
            }

            usersUsernames = req.body.users || [];
            users = usersUsernames.map(function (username) {
                return usersCollection.find({
                    usernameLower: username.toLowerCase()
                });
            }).filter(function (user) {
                return !!user;
            });

            if (users.length !== usersUsernames.length) {
                res.status(400)
                    .json('Invalid users added');
                return;
            }

            users.push(user);
            user.events = user.events || [];

            event = {
                id: uuid(),
                title: req.body.title,
                category: req.body.category || 'uncategorized',
                description: req.body.description,
                date: new Date(req.body.date),
                creatorId: user.id,
                users: users.map(function (user) {
                    return user.id;
                })
            };

            users.forEach(function (user) {
                user.events = user.events || [];
                user.events.push(event);
            });

            res.status(201)
                .json({
                    result: event
                });
        });

    return router;
};
