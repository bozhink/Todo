var express = require('express'),
    uuid = require('uuid');

require('../polyfills/array');

function TodoDAO(db) {
    'use strict';

    var usersCollection = db('users');

    function getTodos(user, callback) {
        var todos;
        if (!user) {
            callback('Not authorized User', null);
            return;
        }

        todos = user.todos || [];
        callback(null, todos);
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
            id: uuid(),
            text: todo.text,
            state: !!todo.state || false,
            category: todo.category || 'uncategorized'
        };

        user.todos = user.todos || [];
        user.todos.push(dbTodo);
        db.write();

        callback(null, todo);
    }

    function updateTodo(user, todo, callback) {
        //
    }

    return {
        getTodos,
        addTodo,
        updateTodo
    };
}

module.exports.TodoDAO = TodoDAO;