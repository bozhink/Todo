function CategoriesService(authorizationService, requester) {
    'use strict';

    function get() {
        var options = {
            headers: {
                'x-auth-key': authorizationService.getHeaders()
            }
        };

        return requester.get('api/categories', options)
            .then(function (res) {
                return res.result;
            });
    }

    return {
        get: get
    };
}

module.exports = CategoriesService;