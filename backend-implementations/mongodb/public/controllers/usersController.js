var usersController = function() {
    function all(context) {
        var users;
        data.users.get()
            .then(function(resUsers) {
                users = resUsers;
                return templates.get('users');
            })
            .then(function(template) {
                context.$element().html(template(users));
                $('.btn-add-friend').on('click', function() {
                    var id = $(this).parents('.user-box').attr('data-id');
                    data.friends.sentRequest(id);
                });
            })
            .catch(controllerHelpers.catchError);
    }

    function register(context) {
        templates.get('register')
            .then(function(template) {
                context.$element().html(template());

                $('#btn-register').on('click', function() {
                    var user = {
                        username: $('#tb-reg-username').val(),
                        password: $('#tb-reg-pass').val()
                    };

                    data.users.register(user)
                        .then(function() {
                            toastr.success('User registered!');
                            context.redirect('#/');
                            document.location.reload(true);
                        })
                        .catch(controllerHelpers.catchError);
                });
            })
            .catch(controllerHelpers.catchError);
    }

    return {
        all: all,
        register: register
    };
}();