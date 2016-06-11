/**
 * Created by bernatmir on 10/6/16.
 */
angular.module('starter').controller('mydroneCtrl',['$scope','ionicMaterialInk', 'ionicMaterialMotion', '$ionicModal', '$ionicPopover', '$timeout', '$http','$ionicPopup', '$state','socketio','$ionicScrollDelegate','$cordovaCamera','$cordovaFileTransfer', function($scope,ionicMaterialInk, ionicMaterialMotion, $ionicModal, $ionicPopover, $timeout, $http,$ionicPopup, $state,socket, $ionicScrollDelegate,$cordovaCamera,$cordovaFileTransfer) {

    $scope.newDrone={};
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.picture={};
    $scope.$parent.setHeaderFab('left');
    var usuario = JSON.parse(sessionStorage["user"]);

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);
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

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();

    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.addtomydron= function (id) {
        var lotiene=false;
        $http.post(base_url+'/user/addDr/'+id, {
            userid:usuario.userid,
            token:usuario.token
        }).success(function (data) {
            getdrones();
            $ionicPopup.alert({
                title: 'Drone ',
                content: 'Drone Added to your list'
            });
        })
    }

    $scope.deletetomydron= function (id) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete message',
            template: 'Are you sure you want to delete this drone?'
        });
        confirmPopup.then(function(res) {
            if(res) {
            $http.delete(base_url+'/user/addDr/'+id, {headers: {'x-access-token':usuario.token, userid: usuario.userid}
            }).success(function (data) {
                getdrones();
            })
        }
    })

    };
    $scope.drones={};
    $scope.mydrones={};
    $scope.dronesid={};
    $scope.doRefresh = function() {
        getdrones();
        $scope.$broadcast('scroll.refreshComplete');
    }
    function getdrones(){
        console.log('entro en obtener drones');
            var miUsuario = JSON.parse(sessionStorage["user"]);
            $http.get(base_url+'/users/'+miUsuario.userid,{headers: {'x-access-token': miUsuario.token}}).success(function (data) {
                $scope.mydrones=data.mydrones;
                console.log('mis drones'+$scope.mydrones);
            });

    }
    getdrones();
    $scope.createDrone = function() {
        if (!$scope.newDrone.vendor || !$scope.newDrone.desc || !$scope.newDrone.mod) {
            $ionicPopup.alert({
                title: 'Error ',
                content: 'Fill the fields correctly'
            });
        }
        else {


        var options = {
            fileKey: "file",
            fileName: 'filename.jpg',
            mimeType: 'image/jpeg',
            chunkedMode: false,
            params: {
                vendor: $scope.newDrone.vendor,
                description: $scope.newDrone.desc,
                model: $scope.newDrone.mod
            }
        };
        $cordovaFileTransfer.upload(base_url + '/drones', $scope.picture, options).then(
            function (data) {
                $ionicPopup.alert({
                    title: 'Drone ',
                    content: 'Drone Added correctly'
                });
                $scope.newDrone=null;
                getdrones();
            }, function (err) {
                console.log(err);
                $ionicPopup.alert({
                    title: 'Fill the fields correctly ',
                    content: err
                });
            });
    }
    };

    $scope.addDrone= function () {

    }

}]);