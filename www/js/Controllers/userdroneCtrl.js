/**
 * Created by bernatmir on 11/6/16.
 */
angular.module('starter').controller('userdroneCtrl',['$scope','ionicMaterialInk', 'ionicMaterialMotion', '$ionicModal', '$ionicPopover', '$timeout', '$http','$ionicPopup', '$state','socketio','$ionicScrollDelegate','$cordovaCamera','$cordovaFileTransfer', function($scope,ionicMaterialInk, ionicMaterialMotion, $ionicModal, $ionicPopover, $timeout, $http,$ionicPopup, $state,socket, $ionicScrollDelegate,$cordovaCamera,$cordovaFileTransfer) {
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
        console.log('entro en obtener drones del usuario');
        var username =sessionStorage["userSearch"];
        $http.get(base_url+'/api/user/'+username).success(function (data) {
            $scope.userdrones=data.mydrones;
            console.log('mis drones'+$scope.userdrones);
            var miUsuario = JSON.parse(sessionStorage["user"]);
            $http.get(base_url+'/users/'+miUsuario.userid,{headers: {'x-access-token': miUsuario.token}}).success(function (data) {
                $scope.mydrones=data.mydrones;
                for(var i=0;i<  $scope.mydrones.length;i++) {
                    for (var j = 0; j < $scope.userdrones.length; j++) {
                        if (  $scope.mydrones[i]._id == $scope.userdrones[j]._id) {
                            $scope.userdrones[j].have=true;
                        }
                        else{
                            $scope.userdrones[j].have=false;

                        }
                    }
                }
            });
        });

    }
    getdrones();
}])