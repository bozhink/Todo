function ListUsersController($scope, usersService, messageService) {
    'use strict';
    usersService.get()
        .success(function (users) {
            $scope.users = users;
        })
        .catch(function (error) {
            messageService.error(error);
        });
}

module.exports = ListUsersController;