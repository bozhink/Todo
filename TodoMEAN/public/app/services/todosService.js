function TodosService(authorizationService, requester) {
    'use strict';

    function get() {
        var options = {
            headers: authorizationService.getHeaders()
        };

        return requester.get('api/todos', options)
            .then(function (res) {
                return res.result;
            });
    }

    function add(todo) {
        var options = {
            data: todo,
            headers: authorizationService.getHeaders()
        };

        return requester.post('api/todos', options)
            .then(function (res) {
                return res.result;
            });
    }

    function update(id, todo) {
        var options = {
            data: todo,
            headers: authorizationService.getHeaders()
        };

        return requester.put('api/todos/' + id, options)
            .then(function (res) {
                return res.result;
            });
    }

    return {
        add: add,
        get: get,
        update: update
    };
}

module.exports = TodosService;
