/**
 * Created by bernat on 17/04/16.
 */

angular.module('starter').controller('SignupCtrl',function($scope, $ionicModal, $ionicPopover,ionicMaterialInk, $timeout, $http,$ionicPopup, $state, $cordovaCamera, $cordovaFileTransfer) {
    $scope.picture;
    $scope.newUser = {};
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();
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
        var UsarioLocalNuevo = new FormData();
        UsarioLocalNuevo.append('username', $scope.newUser.username);
        UsarioLocalNuevo.append('password', $scope.newUser.password);
        UsarioLocalNuevo.append('name', $scope.newUser.name);
        UsarioLocalNuevo.append('lastname', $scope.newUser.lastname);
        UsarioLocalNuevo.append('mail', $scope.newUser.mail);
        UsarioLocalNuevo.append('imageUrl', $('#imgInp')[0].files[0]);
        $http.post(base_url + '/users',UsarioLocalNuevo)
            .success(function (data) {
            $state.go('app.login');
        }).error(function (err) {
            console.log(err);
            $ionicPopup.alert({
                title: 'Fill the fields correctly ',
                content: err
            });

        });
    }
    $scope.User = function () {
        var options ={
        fileKey: "file",
        fileName: 'filename.jpg',
        mimeType: 'image/jpeg',
        chunkedMode:false,
        params: { username: $scope.newUser.username,
            password: $scope.newUser.password,
            name: $scope.newUser.name,
            lastname: $scope.newUser.lastname,
            mail: $scope.newUser.mail}
        };
        if($scope.newUser.username==undefined || $scope.newUser.password==undefined || $scope.newUser.name==undefined || $scope.newUser.lastname==undefined || $scope.newUser.mail==undefined ){
            $ionicPopup.alert({
                title: 'Error',
                content: 'Fill the fields correctly '
            });
        }
        else if($scope.picture==undefined){
            $ionicPopup.alert({
                title: 'Error',
                content: 'Please select a foto '
            });
        }
       else {
            $cordovaFileTransfer.upload(base_url + '/user_movil', $scope.picture, options).then(
                function (data) {
                    $state.go('app.login');
                }, function (err) {
                    console.log(err);
                    $ionicPopup.alert({
                        title: 'Fill the fields correctly ',
                        content: err
                    });
                });
        }
    }
    
    
});
    