function EventsService(authorizationService, requester) {
    'use strict';

    function get() {
        var options = {
            headers: authorizationService.getHeaders()
        };
        return requester.get('api/events', options)
            .then(function (res) {
                return res.result;
            });
    }

    function add(event) {
        var options = {
            data: event,
            headers: authorizationService.getHeaders()
        };

        return requester.post('api/events', options)
            .then(function (res) {
                return res.result;
            });
    }

    return {
        add: add,
        get: get
    };
}

module.exports = EventsService;
