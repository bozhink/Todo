/* globals toastr */
function MessageService() {
    'use strict';

    function info(message) {
        toastr.info(message);
    }

    function success(message) {
        toastr.success(message);
    }

    function warning(message) {
        toastr.warning(message);
    }

    function error(message) {
        toastr.error(message);
    }

    return {
        info: info,
        success: success,
        warning: warning,
        error: error
    };
}

module.exports = MessageService;