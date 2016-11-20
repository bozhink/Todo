function RegisterUsersController($scope, usersService, messageService) {
    $scope.username = '';
    $scope.password = '';

    $scope.register = function () {
        alert('here');

        usersService.register({
                username: $scope.username,
                password: $scope.password
            })
            .success(function () {
                document.location = '#/';
                document.location.reload(true);
            })
            .catch(function (error) {
                messageService.error(error);
            });
    }
}

module.exports = RegisterUsersController;
