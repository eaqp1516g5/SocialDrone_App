/**
 * Created by Admin on 07/06/2016.
 */
angular.module('starter').controller('conversationsCtrl',['$scope','ionicMaterialInk', 'ionicMaterialMotion', '$ionicModal', '$ionicPopover', '$timeout', '$http','$ionicPopup', '$state','socketio', function($scope,ionicMaterialInk, ionicMaterialMotion, $ionicModal, $ionicPopover, $timeout, $http,$ionicPopup, $state,socket) {
    // Delay expansion
    $timeout(function () {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);
    $scope.conversations=[];
    $scope.page=0;
    $scope.nomore=true;
    $scope.refresh = function(){
        $scope.page=0;
        $scope.nomore=true;
        $scope.convers();
        $scope.$broadcast('scroll.refreshComplete');

    }
    $scope.convers = function () {
            if (sessionStorage["user"] != undefined) {
                var usuario = JSON.parse(sessionStorage["user"]);
                $http.get(base_url + '/chatt/page=' + $scope.page, {
                        headers: {
                            'x-access-token': usuario.token,
                            userid: usuario.userid
                        }
                    })
                    .success(function (data) {
                        $scope.conversations=data.data;
                        $scope.page=$scope.page+1;
                    })
                    .error(function (err) {
                    });
            }
    }
    $scope.mas=function(){
        if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.get(base_url + '/chatt/page=' + $scope.page, {
                    headers: {
                        'x-access-token': usuario.token,
                        userid: usuario.userid
                    }
                })
                .success(function (data) {
                    if(data.data.length==0){
                        $scope.nomore=false;
                    }else{
                    for(var i = 0; i<data.data.length;i++) {
                        $scope.conversations.push(data.data[i]);
                    }
                    $scope.page=$scope.page+1;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                })
                .error(function (err) {
                    $scope.nomore=false;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }
    }
    $scope.convers();
    $scope.ir=function(id){
        sessionStorage['conver']=JSON.stringify({_id: id});
        $state.go('app.chat');
    }

}]);