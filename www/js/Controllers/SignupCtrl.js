/**
 * Created by bernat on 17/04/16.
 */

angular.module('starter').controller('SignupCtrl', function($scope, $ionicModal, $ionicPopover, $timeout, $http,$ionicPopup, $state, $cordovaCamera) {
    $scope.picture;
    $scope.newUser = {};
    $scope.takePicture = function(options){
        var options = {
            quality: 80,
            sourceType: 1
        }
        $cordovaCamera.getPicture(options).then(function(imageData){
            $scope.picture=imageData;
        }, function(err){
            console.log(err);
        })
    }
    $scope.getPicture = function(options){
        var options = {
            quality: 80,
            sourceType: 0
        }
        $cordovaCamera.getPicture(options).then(function(imageData){
            $scope.picture=imageData;
        }, function(err){
            console.log(err);
        })
    }
    $scope.crearUser = function () {
        console.log($scope.newUser);
        $http.post(base_url + '/users', {
            username: $scope.newUser.username,
            password: $scope.newUser.password,
            name: $scope.newUser.name,
            lastname: $scope.newUser.lastname,
            mail: $scope.newUser.mail,
            imageUrl: $scope.picture
        }).success(function (data) {
            $state.go('app.login');
        }).error(function (err) {
            console.log(err);
            $ionicPopup.alert({
                title: 'Fill the fields correctly ',
                content: err
            });

        });
    }
    
    
});
    