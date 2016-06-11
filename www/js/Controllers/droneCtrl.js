angular.module('starter').controller('droneCtrl',['$scope','ionicMaterialInk', 'ionicMaterialMotion', '$ionicModal', '$ionicPopover', '$timeout', '$http','$ionicPopup', '$state','socketio','$ionicScrollDelegate','$cordovaCamera','$cordovaFileTransfer', function($scope,ionicMaterialInk, ionicMaterialMotion, $ionicModal, $ionicPopover, $timeout, $http,$ionicPopup, $state,socket, $ionicScrollDelegate,$cordovaCamera,$cordovaFileTransfer) {
    // Set Header
    $scope.newDrone={};
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    //$scope.picture={};
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
    $scope.doRefresh = function() {
        getdrones();
        $scope.$broadcast('scroll.refreshComplete');
    }
    var usuario = JSON.parse(sessionStorage["user"]);
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
        console.log(usuario);
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
        $http.delete(base_url+'/user/addDr/'+id, {headers: {'x-access-token':usuario.token, userid: usuario.userid}
        }).success(function (data) {
            getdrones();
            $ionicPopup.alert({
                title: 'Drone ',
                content: 'Drone deleted from your list'
            });
        })
    };
$scope.drones={};
    $scope.mydrones={};
    $scope.dronesid={};
    function getdrones(){
        console.log('entro en obtener drones')
        $http.get(base_url+'/drones').success(function (data) {
                $scope.drones = data;
            var miUsuario = JSON.parse(sessionStorage["user"]);
            console.log('hay '+$scope.drones.length+' drones ');
            $http.get(base_url+'/users/'+usuario.userid,{headers: {'x-access-token': miUsuario.token}}).success(function (data) {
                $scope.mydrones=data.mydrones;
                console.log($scope.mydrones);
                for(var i=0;i<  $scope.mydrones.length;i++) {
                    for (var j = 0; j < $scope.drones.length; j++) {
                        if (  $scope.mydrones[i]._id == $scope.drones[j]._id) {
                            $scope.drones[j].have=true;
                        }
                        else{
                            $scope.drones[j].have=false;

                        }
                    }
                }
            });
        })

        }
    getdrones();
    $scope.createDrone = function() {
        console.log('pictureeee');
        console.log($scope.picture);
        if (!$scope.newDrone.vendor || !$scope.newDrone.desc || !$scope.newDrone.mod) {
            $ionicPopup.alert({
                title: 'Error ',
                content: 'Fill the fields correctly'
            });
        }
        else if($scope.picture==undefined){
            $ionicPopup.alert({
                title: 'Error ',
                content: 'Please select a photo'
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
                $scope.picture=undefined;
                $scope.newDrone = null;
                getdrones()
            }, function (err) {
                console.log(err);
                $ionicPopup.alert({
                    title: 'Fill the fields correctly ',
                    content: err
                });
            })
    }
    };

    $scope.addDrone= function () {

    }

}]);