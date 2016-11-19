var express = require('express'),
    EventDAO = require('../data/events').EventDAO;

module.exports = function (db) {
    'use strict';

    var router = express.Router(),
        events = new EventDAO(db);

    router
        .get('/', function (req, res) {
            var user = req.user;
            if (!user) {
                res.status(401)
                    .json('Not authorized User');
                return;
            }

            events.getEvents(user, function (err, events) {
                if (!!err) {
                    res.status(400)
                        .json(err);
                    return;
                }

                res.json({
                    result: events
                });
            });
        })
        .post('/', function (req, res) {
            var event, user = req.user;
            if (!user) {
                res.status(401)
                    .json('Not authorized User');
                return;
            }

            event = {
                title: req.body.title,
                category: req.body.category || 'uncategorized',
                description: req.body.description,
                date: new Date(req.body.date),
                usersUsernames: req.body.users || []
            };

            events.addEvent(user, event, function (err, event) {
                if (!!err || !event) {
                    res.status(400)
                        .json(err);
                    return;
                }

                res.status(201)
                    .json({
                        result: event
                    });
            });
        });

    return router;
};
