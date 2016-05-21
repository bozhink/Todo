var express = require('express'),
    uuid = require('uuid'),
    TodoDAO = require('../data/todos').TodoDAO;

require('../polyfills/array');

module.exports = function (db) {
    var router = express.Router(),
        todos = new TodoDAO(db);

    router
        .get('/', function (req, res) {
            var user = req.user;
            if (!user) {
                res.status(401)
                    .json('Not authorized User');
                return;
            }

            todos.getTodos(user, function (err, todos) {
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
        .post('/', function (req, res) {
            var todo, user = req.user;
            if (!user) {
                res.status(401)
                    .json('Not authorized User');
                return;
            }

            todo = {
                id: uuid(),
                text: req.body.text,
                state: !!req.body.state || false,
                category: req.body.category || 'uncategorized'
            };

            user.todos = user.todos || [];
            user.todos.push(todo);

            res.status(201)
                .json({
                    result: todo
                });
        })
        .put('/:id', function (req, res) {
            var id, todo, update, user = req.user;
            if (!user) {
                res.status(401)
                    .json('Not authorized User');
                return;
            }

            id = req.params.id;
            todo = user.todos.find(function (dbTodo) {
                return dbTodo.id === id;
            });

            if (!todo) {
                res.status(404)
                    .json('Todo with such id does not exist in DB');
                return;
            }

            update = req.body;

            todo.text = (typeof update.text === 'undefined') ? todo.text : update.text;
            todo.state = (typeof update.state === 'undefined') ? todo.state : update.state;

            db.write();

            res.json({
                result: todo
            });
        });

    return router;
};
