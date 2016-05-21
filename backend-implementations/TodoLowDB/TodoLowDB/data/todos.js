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
        //
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