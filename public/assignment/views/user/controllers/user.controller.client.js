/**
 * Created by Akshay on 2/15/2017.
 */
(function() {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("ProfileController", ProfileController)
        .controller("RegisterController", RegisterController);

    function LoginController(UserService, $location) {
        var vm = this;
        vm.login = login;

        function login(user) {
            var loginUser = UserService.findUserByCredentials(user.username, user.password);
            if(loginUser != null) {
                $location.url('/user/' + loginUser._id);
            } else {
                vm.error = 'user not found';
            }
        }
    }

    function ProfileController($routeParams, UserService) {
        var vm = this;
        var userId = $routeParams['uid'];
        var user = UserService.findUserById(userId);
        vm.user = user;
        console.log(user);

        vm.update = function (newUser) {
            var user = UserService.updateUser(userId, newUser);
            if(user == null) {
                vm.error = "unable to update user";
            } else {
                vm.message = "user successfully updated"
            }
        };

        vm.delete = function (userId) {
            var user = UserService.deleteUser(userId);
            if (user != null) {
                console.log("Deleted.");
                vm.message = "Successfully deleted.";
            }
            else {
                vm.error = "Some error occurred.";
            }
        };

    }

    function RegisterController($location, UserService) {
        var vm = this;
        vm.register = function register(user) {
            if(user == null || user.username == null || user.password == null){
                vm.error = "Please enter your details!";
                return;
            }
            if (user.password != user.verifypassword) {
                vm.error = "Password mismatch";
                return;
            }
            var check_username = UserService.findUserByUsername(user.username);
            if (check_username != null){
                vm.error = "Username already in use.";
                return;
            }
            var newuser = UserService.createUser(user);
            console.log(newuser);
            $location.url("/user/"+newuser._id);
        }
    }
})();