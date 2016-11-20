const LOCAL_STORAGE_USERNAME_KEY = 'signed-in-user-username';
const LOCAL_STORAGE_AUTHKEY_KEY = 'signed-in-user-auth-key';

function AuthorizationService(storage) {
    'use strict';

    function getHeaders() {
        return {
            'x-auth-key': storage.get(LOCAL_STORAGE_AUTHKEY_KEY)
        };
    }

    function setCredentials(username, authKey) {
        storage.set(LOCAL_STORAGE_USERNAME_KEY, username);
        storage.set(LOCAL_STORAGE_AUTHKEY_KEY, authKey);
    }

    function removeCredentials() {
        storage.remove(LOCAL_STORAGE_USERNAME_KEY);
        storage.remove(LOCAL_STORAGE_AUTHKEY_KEY);
    }

    function hasUser() {
        return !!storage.get(LOCAL_STORAGE_USERNAME_KEY) &&
            !!storage.get(LOCAL_STORAGE_AUTHKEY_KEY);
    }

    return {
        getHeaders: getHeaders,
        setCredentials: setCredentials,
        removeCredentials: removeCredentials,
        hasUser: hasUser
    };
}

module.exports = AuthorizationService;