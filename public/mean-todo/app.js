/**
 * Created by 4kshay on 1/13/2017.
 */
angular
    .module("TodoApp", [])
    .controller("TodoController", TodoController)

function TodoController($scope) {
    $scope.todos = [
    {'title': 'Todo 1', 'note': 'Note1'},
    {'title': 'Todo 2', 'note': 'Note2'},
    {'title': 'Todo 3', 'note': 'Note3'},
    {'title': 'Todo 4', 'note': 'Note4'},
    {'title': 'Todo 5', 'note': 'Note5'}
    ];
}
