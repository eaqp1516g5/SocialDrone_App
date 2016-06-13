/**
 * Created by Admin on 07/06/2016.
 */
angular.module('starter').controller('chatCtrl',['$scope','ionicMaterialInk', 'ionicMaterialMotion', '$ionicModal', '$ionicPopover', '$timeout', '$http','$ionicPopup', '$state','socketio','$ionicScrollDelegate','$rootScope', function($scope,ionicMaterialInk, ionicMaterialMotion, $ionicModal, $ionicPopover, $timeout, $http,$ionicPopup, $state,socket, $ionicScrollDelegate,$rootScope) {
    // Delay expansion
    var conver={};
    $timeout(function () {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);
    var viewscroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
    $scope.input={};
    $scope.chat=[];
    if(sessionStorage['conver']!=null||sessionStorage['conver']!=undefined){
        if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $scope.usuar= usuario;
            $http.get(base_url+'/users/'+usuario.userid,{headers: {'x-access-token': usuario.token}}).success(function (data) {
                console.log('salido');
                console.log(sessionStorage['socket'])
                if(sessionStorage['socket']!=undefined){
                    var anda=JSON.parse(sessionStorage['socket']);
                    console.log(anda);
                    if(anda!=true) {
                        console.log('entro');
                        sessionStorage['socket'] = JSON.stringify(true);
                        socket.emit('username', data.username);
                    }
                    if(sessionStorage['conver']!=undefined) {
                        conver = JSON.parse(sessionStorage['conver']);
                        $timeout(function(){
                            $http.get(base_url + '/chatt/conversation/' + conver._id, {headers: {'x-access-token': usuario.token}})
                                .success(function (data) {
                                    $scope.chat = data;
                                    $timeout(function () {
                                        viewscroll.scrollBottom();
                                    }, 0);
                                    socket.emit('visto', {userid: usuario.userid, chat: conver._id});
                                })
                                .error(function (err) {
                                });
                        },100)
                    }
                }
                }).error(function(err){
            });
        }
    }
    $scope.viewProfile = function(profile){
        sessionStorage["userSearch"]=profile;
        $state.go('app.usersearch');
    }
    $scope.sendMessage=function(){
        socket.emit('chatmessage',{userid: usuario.userid,text: $scope.input.message, chatid: conver._id});
    }
    socket.on('chatmessage', function(data){
        console.log(data);
        if(data.chatid._id==conver._id) {
            $scope.chat.push(data);
            $scope.input = {};
            $timeout(function(){
                    viewscroll.scrollBottom();
            },0)
            socket.emit('visto', {userid: usuario.userid, chat: conver._id});
        }
    })
    $http.get(base_url + '/users').success(function (data) {
        $scope.users = data;
        console.log("Obtengo users");
        console.log($scope.users);
    });
    var _selected;
    $scope.selected = undefined;
    $scope.onSelect = function ($item, $model, $label) {
        //window.location.href = "/user";
        $http.post(base_url+'/chatt/user', {
            token: usuario.token,
            user: $model._id,
            userid: usuario.userid,
            conversation_id: conver._id
        }).success(function (data) {
        }).error(function (err) {
        });
        $scope.$item = $item;
        $scope.$model = $model;
        $scope.$label = $label;
        $scope.userSelected = $model.username;

    };
    $scope.age = function(a){
        return new Date(a);
    }
    socket.emit('visto', {userid: usuario.userid, chat: conver._id});
}]);