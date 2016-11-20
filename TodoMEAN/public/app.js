/* globals angular $ */
var Hasher = require('./app/hasher'),
    Storage = require('./app/storage'),
    JsonRequester = require('./app/json-requester'),
    AuthorizationService = require('./app/services/authorizationService'),
    MessageService = require('./app/services/messageService'),
    EventsService = require('./app/services/eventsService'),
    TodosService = require('./app/services/todosService'),
    CategoriesService = require('./app/services/categoriesService'),
    UsersService = require('./app/services/usersService'),
    ListUsersController = require('./app/controllers/listUsersController'),
    RegisterUsersController = require('./app/controllers/registerUsersController');

var app = angular.module('mean-todo', ['ngRoute'])
    .factory('Hasher', [Hasher])
    .factory('Storage', [Storage])
    .factory('JsonRequester', ['$http', JsonRequester])
    .factory('AuthorizationService', ['Storage', AuthorizationService])
    .factory('MessageService', [MessageService])
    .factory('EventsService', ['AuthorizationService', 'JsonRequester', EventsService])
    .factory('TodosService', ['AuthorizationService', 'JsonRequester', TodosService])
    .factory('CategoriesService', ['AuthorizationService', 'JsonRequester', CategoriesService])
    .factory('UsersService', ['AuthorizationService', 'JsonRequester', 'Hasher', UsersService])

app.controller('ListUsersController', ['$scope', 'UsersService', 'MessageService', ListUsersController]);

app.controller('RegisterUsersController', ['$scope', 'UsersService', 'MessageService', RegisterUsersController]);

app.controller('HomeController', ['$scope', 'UsersService', 'Storage', 'MessageService', function HomeController($scope, usersService, storage, messageService) {
    if (usersService.hasUser()) {
        $('#container-sign-in').addClass('hidden');

        $('#container-sign-out').removeClass('hidden');
        $('#user-name-label').html(storage.get('signed-in-user-username'));
        $('#btn-sign-out').on('click', function (e) {
            e.preventDefault();
            usersService.signOut()
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
            usersService.signIn(user)
                .then(function () {
                    document.location = '#/';
                    document.location.reload(true);
                }, function (error) {
                    $('#container-sign-in').trigger("reset");
                    messageService.error(error.responseText);
                });
        });
    }
}]);

app.controller('TodosController', ['$scope', '$location', 'TodosService', function TodosController($scope, $location, todosService) {
    var category = $location.search().category || null;

    todosService.get()
        .success(function (resTodos) {
            $scope.todos = resTodos;
            console.log($scope.todos);
        });

    $scope.add = function () {}
}]);

app.controller('TodosAddController', ['$scope', '$location', 'TodosService', 'CategoriesService', 'MessageService', function TodosAddController($scope, $location, todosService, categoriesService, messageService) {
    $scope.text = '';
    $scope.category = '';

    $scope.init = function () {
        categoriesService.get()
            .success(function (categories) {
                $('#tb-todo-category').autocomplete({
                    source: categories
                });
            })
            .catch(function (error) {
                messageService.error(error);
            });
    };

    $scope.add = function () {
        var todo = {
            text: $scope.text,
            category: $scope.category
        };

        todosService.add(todo)
            .success(function (todo) {
                messageService.success(`TODO "${todo.text}" added!`);
                document.location = '#/todos';
                document.location.reload(true);
            })
            .catch(function (error) {
                messageService.error(error);
            });
    }
}]);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'HomeController',
            templateUrl: '/templates/home.ng.html'
        })
        .when('/todos', {
            controller: 'TodosController',
            templateUrl: '/templates/todos.ng.html'
        })
        .when('/todos/add', {
            controller: 'TodosAddController',
            templateUrl: '/templates/todos.add.ng.html'
        })
        .when('/events', {
            templateUrl: '/templates/events.ng.html'
        })
        .when('/events/add', {
            templateUrl: '/templates/events.add.ng.html'
        })
        .when('/users', {
            controller: 'ListUsersController',
            templateUrl: '/templates/users.ng.html'
        })
        .when('/users/register', {
            controller: 'RegisterUsersController',
            templateUrl: '/templates/users.register.ng.html'
        });
}]);
