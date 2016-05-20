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

            events.getEvents(user, function (events) {
                res.json({
                    result: events
                });
            });
        })
        .post('/', function (req, res) {
            var usersUsernames = req.body.users || [], user = req.user;
            if (!user) {
                res.status(401)
                    .json('Not authorized User');
                return;
            }

            events.addEvent(user, req.body.title, req.body.category, req.body.description, new Date(req.body.date), usersUsernames, function (event, err) {
                if (!!err || !event) {
                    res.status(400)
                        .json(JSON.stringify(err));
                }

                res.status(201)
                    .json({
                        result: event
                    });
            });
        });

    return router;
};
