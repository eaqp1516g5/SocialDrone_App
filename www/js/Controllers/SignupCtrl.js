/**
 * Created by bernat on 17/04/16.
 */

angular.module('starter').controller('SignupCtrl', function($scope, $ionicModal, $ionicPopover, $timeout, $http,$ionicPopup, $state) {


    $scope.newUser = {};
    
    $scope.crearUser = function () {
        console.log($scope.newUser);
        $http.post(base_url + '/users', {
            username: $scope.newUser.username,
            password: $scope.newUser.password,
            name: $scope.newUser.name,
            lastname: $scope.newUser.lastname,
            mail: $scope.newUser.mail
        }).success(function (data) {
            $state.go('app.profile');
        }).error(function (err) {
            console.log(err);
            $ionicPopup.alert({
                title: 'Fill the fields correctly ',
                content: err
            });

        });
    }
    
    
});
    