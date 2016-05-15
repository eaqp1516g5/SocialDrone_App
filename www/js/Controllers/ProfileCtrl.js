/**
 * Created by bernat on 17/04/16.
 */

angular.module('starter').controller('ProfileCtrl', function($scope,$state, $stateParams,$location, $timeout, ionicMaterialMotion, ionicMaterialInk, $http, $ionicPopup) {
    $scope.users={};
    $scope.myUser={};
    $scope.us={};
    $scope.currentUser={};
    $scope.messages={};

   /* function getUser() {
        console.log(sessionStorage["user"]);
        if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            console.log('usuario: '+usuario);
            $http.get(base_url + '/users/' + usuario.userid, {headers: {'x-access-token': usuario.token}})
                .success(function (data) {
                    $scope.currentUser=data;
                    console.log($scope.currentUser.imageUrl);
                })
                .error(function (err) {
                });
        }
    }
    getUser();*/
    /*function getUsers() {
        if(sessionStorage["user"]!=undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.get(base_url + '/users',  {headers: {'x-access-token': usuario.token}})
                .success(function (data) {
                    $scope.users = data;
                    $scope.currentUser=usuario;


                })
                .error(function (err) {
                    console.log(err);
                });
        }
    }
    getUsers();*/

    $scope.following= function (numFollowing) {
        if(numFollowing!=0)
        $state.go("app.following");
    };
    $scope.followers= function (numFollowers) {
        if(numFollowers!=0)
         $state.go("app.followers");
    };
    function getMyMessages (){
        if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.get(base_url+'/message/user/'+usuario.userid).success(function (data) {
                $scope.messages=data;
            }).error(function (err) {
                console.log(err)
            });
        }
    }
    getMyMessages();
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function () {
        ionicMaterialMotion.fadeSlideInRight();
    }, 300);

    // Set Ink
    ionicMaterialInk.displayEffect();

    $scope.selectUser=function (user) {
        $scope.myUser.username=user.username;
        $scope.myUser.mail=user.mail;
    };

    $scope.deleteUser = function () {
        console.log('Entro');
        if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.delete(base_url + '/users/' + $scope.myUser.username, {headers: {'x-access-token': usuario.token}}).success(function () {
                $scope.myUser.username = null;
                $scope.myUser.mail = null;
                $http.get(base_url + '/users', {headers: {'x-access-token': usuario.token}})
                    .success(function (data) {
                        console.log(data);
                        $scope.users = data;
                    })
                    .error(function (err) {
                        console.log(err);
                    });
            }).error(function (error, status, headers, config) {
                console.log(error);
                $ionicPopup.alert({
                    title: 'Error',
                    content: error
                });
            });
        }
        
    };

    $scope.modifyEmail = function () {
        if (sessionStorage["user"] != undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.put(base_url + '/users/' + $scope.myUser.username, {
                token: usuario.token,
                mail: $scope.myUser.mail
            }).success(function () {
                    console.log('Modificado');
                    getUsers();
                })
                .error(function (error) {
                    console.log(error);
                    $ionicPopup.alert({
                        title: 'Error',
                        content: error
                    });
                });
        }
    }
    
});