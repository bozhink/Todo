(function () {
    var sammyApp = Sammy('#content', function () {
        this.get('#/', homeController.all);

        this.get('#/todos', todosController.all);
        this.get('#/todos/add', todosController.add);

        this.get('#/events', eventsController.all);
        this.get('#/events/add', eventsController.add);

        this.get('#/users', usersController.all);
        this.get('#/users/register', usersController.register);
    });

    $(function () {
        sammyApp.run('#/');

        if (data.users.hasUser()) {
            $('#container-sign-in').addClass('hidden');

            $('#container-sign-out').removeClass('hidden');
            $('#user-name-label').html(localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY));
            $('#btn-sign-out').on('click', function (e) {
                e.preventDefault();
                data.users.signOut()
                    .then(function () {
                        document.location = '#/';
                        document.location.reload(true);
                    });
            });
        } else {
            $('#user-name-label').html('');
            $('#container-sign-out').addClass('hidden');

            $('#container-sign-in').removeClass('hidden');
            $('#btn-sign-in').on('click', function (e) {
                e.preventDefault();
                var user = {
                    username: $('#tb-username').val(),
                    password: $('#tb-password').val()
                };
                data.users.signIn(user)
                    .then(function (user) {
                        document.location = '#/';
                        document.location.reload(true);
                    }, function (err) {
                        $('#container-sign-in').trigger("reset");
                        toastr.error(err.responseText);
                    });
            });
        }
    });
} ());
