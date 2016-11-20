function UsersService(authorizationService, requester, hasher) {
    'use strict';

    function register(user) {
        var reqUser = {
            username: user.username,
            passHash: hasher.hash(user.username + user.password)
        };

        return requester.post('api/users', {
            data: reqUser
        }).then(function (res) {
            var user = res.result;
            authorizationService.setCredentials(user.username, user.authKey);
            return {
                username: user.username
            };
        });
    }

    function signIn(user) {
        var reqUser = {
                username: user.username,
                passHash: hasher.hash(user.username + user.password)
            },
            options = {
                data: reqUser
            };

        return requester.put('api/users/auth', options)
            .then(function (res) {
                var user = res.result;
                authorizationService.setCredentials(user.username, user.authKey);
                return user;
            });
    }

    function signOut() {
        var promise = new Promise(function (resolve, reject) {
            authorizationService.removeCredentials();
            resolve();
        });

        return promise;
    }

    function hasUser() {
        return authorizationService.hasUser();
    }

    function usersGet() {
        return requester.get('api/users')
            .then(function (res) {
                return res.result;
            });
    }

    return {
        signIn: signIn,
        signOut: signOut,
        register: register,
        hasUser: hasUser,
        get: usersGet,
    };
}

module.exports = UsersService;
