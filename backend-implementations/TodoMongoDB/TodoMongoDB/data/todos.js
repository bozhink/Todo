var express = require('express'),
    uuid = require('uuid');

require('../polyfills/array');

function TodoDAO(db) {
    'use strict';

    var usersCollection = db.collection('users');

    function mapDbTodoToResponseModel(todo) {
        return {
            id: todo._id,
            text: todo.text,
            state: todo.state,
            category: todo.category
        };
    }

    function getTodos(user, callback) {
        var todos;
        if (!user) {
            callback('Not authorized User', null);
            return;
        }

        todos = user.todos || [];
        callback(null, todos.map(mapDbTodoToResponseModel));
    }

    function addTodo(user, todo, callback) {
        var dbTodo;
        if (!user) {
            callback('Not authorized User', null);
            return;
        }

        if (!todo) {
            callback('Cannot add null todo', null);
            return;
        }

        dbTodo = {
            _id: uuid(),
            text: todo.text,
            state: !!todo.state || false,
            category: todo.category || 'uncategorized'
        };

        usersCollection.update({
                '_id': user._id
            }, {
                "$push": {
                    "todos": dbTodo
                }
            }, {
                upsert: false,
                w: 1
            },
            function(err, result) {
                callback(err, {
                    text: dbTodo.text,
                    state: dbTodo.state,
                    category: dbTodo.category
                });
            });
    }

    function updateTodo(user, todo, callback) {
        var dbTodo, todos, responseTodo;
        if (!user) {
            callback('Not authorized User', null);
            return;
        }

        if (!todo) {
            callback('Cannot update null todo', null);
            return;
        }

        todos = user.todos || [];
        dbTodo = todos.find((t) => t._id === todo.id);
        if (!dbTodo) {
            callback('Todo with such id does not exist in DB', null);
            return;
        }

        responseTodo = {
            text: (typeof todo.text === 'undefined') ? dbTodo.text : todo.text,
            state: (typeof todo.state === 'undefined') ? dbTodo.state : todo.state,
            category: dbTodo.category
        };

        usersCollection.update({
            '_id': user._id,
            'todos._id': dbTodo._id
        }, {
            '$set': {
                'todos.$.text': responseTodo.text,
                'todos.$.state': responseTodo.state
            }
        }, {
            upsert: false,
            w: 1
        }, function(err, result) {
            callback(err, responseTodo);
        });
    }

    return {
        getTodos,
        addTodo,
        updateTodo
    };
}

module.exports.TodoDAO = TodoDAO;