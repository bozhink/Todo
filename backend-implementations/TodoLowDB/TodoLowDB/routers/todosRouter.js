var express = require('express'),
    TodoDAO = require('../data/todos').TodoDAO;

module.exports = function(db) {
    var router = express.Router(),
        todos = new TodoDAO(db);

    router
        .get('/', function(req, res) {
            var user = req.user;
            if (!user) {
                res.status(401)
                    .json('Not authorized User');
                return;
            }

            todos.getTodos(user, function(err, todos) {
                if (!!err) {
                    res.status(400)
                        .json(err);
                    return;
                }

                res.json({
                    result: todos
                });
            });
        })
        .post('/', function(req, res) {
            var todo, user = req.user;
            if (!user) {
                res.status(401)
                    .json('Not authorized User');
                return;
            }

            todo = {
                text: req.body.text,
                state: !!req.body.state || false,
                category: req.body.category || 'uncategorized'
            };

            todos.addTodo(user, todo, function(err, todo) {
                if (!!err) {
                    res.status(400)
                        .json(err);
                    return;
                }

                res.status(201)
                    .json({
                        result: todo
                    });
            });
        })
        .put('/:id', function(req, res) {
            var id, todo, update, user = req.user;
            if (!user) {
                res.status(401)
                    .json('Not authorized User');
                return;
            }

            todo = {
                id: req.params.id,
                text: req.body.text,
                state: req.body.state
            };

            todos.updateTodo(user, todo, function(err, todo) {
                if (!!err) {
                    res.status(404)
                        .json(err);
                }

                res.json({
                    result: todo
                });
            });
        });

    return router;
};