function Storage() {
    var storage = window.localStorage;

    function set(key, value) {
        storage.setItem(key, value);
    }

    function get(key) {
        return storage.getItem(key);
    }

    function remove(key) {
        storage.removeItem(key);
    }

    return {
        get: get,
        set: set,
        remove: remove
    };
}