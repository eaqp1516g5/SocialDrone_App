/**
 * Created by bernat on 17/04/16.
 */

angular.module('starter').controller('ProfileCtrl', ['$scope','$state', '$stateParams','$location', '$timeout', 'ionicMaterialMotion', 'ionicMaterialInk', '$http', '$ionicPopup','$ionicModal', '$ionicPopover','socketio',function($scope,$state, $stateParams,$location, $timeout, ionicMaterialMotion, ionicMaterialInk, $http, $ionicPopup,$ionicModal, $ionicPopover,socket) {
    $scope.users={};
    $scope.myUser={};
    $scope.us={};
    $scope.currentUser={};
    $scope.messages={};
    $scope.newMessage={};
    $scope.Newcomment={};
    var page = 0;

    $scope.loadMore = function() {
        var usuario = JSON.parse(sessionStorage["user"]);
        console.log(page);
        $http.get(base_url+'/message/user/'+usuario.userid+'/page='+page).success(function (data) {
            page++;
            $scope.messages=data;
            //$scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

    $scope.$on('$stateChangeSuccess', function() {
        $scope.loadMore();
    });
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
    //getMyMessages();
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
   $scope.modalClasses = ['slide-in-up', 'slide-in-down', 'fade-in-scale', 'fade-in-right', 'fade-in-left', 'newspaper', 'jelly', 'road-runner', 'splat', 'spin', 'swoosh', 'fold-unfold'];

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
    $scope.borrarMensaje = function (id) {
        if(sessionStorage["user"]!=undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.delete(base_url + "/message/" + id, {headers: {'x-access-token': usuario.token}})
                .success(function () {
                    getMyMessages();
                })
                .error(function (error, status, headers, config) {
                    console.log(err);
                });
        }
    };
    $scope.enviarMensaje = function(id) {
        if(sessionStorage["user"]!=undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            if (id == undefined) {
                $http.post(base_url + "/message", {
                        username: usuario.userid,
                        text: $scope.newMessage.message,
                        token: usuario.token
                    })
                    .success(function (data, status, headers, config) {
                        getMyMessages();
                        text: $scope.newMessage.message=null;
                        console.log(data);
                    })
                    .error(function (error, status, headers, config) {
                        console.log(error);
                    });
            } else {
                $http.post(base_url + "/comment/" + id, {
                        username: $scope.info.username,
                        id: usuario.userid,
                        text: $scope.newComment.message,
                        token: usuario.token
                    })
                    .success(function (data, status, headers, config) {
                        $http.get(base_url + "/message/" + id) //hacemos get de todos los users
                            .success(function (data) {
                                $scope.message1 = data;
                                $scope.comment = data.comment;
                                $scope.newComment.message = null;
                                console.log(data);
                                getMessage();
                            })
                            .error(function (err) {
                                console.log(err);
                            });
                    })
                    .error(function (error, status, headers, config) {
                        console.log(error);
                    });
            }
        }
    };

    $scope.openModal = function(id) {
        sessionStorage["comment"]=id;
        $ionicModal.fromTemplateUrl('my-modal.html', {
            scope: $scope,
            animation: 'fade-in-scale'
        }).then(function(modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    };

    $scope.showcomments= function (num,id) {
        sessionStorage["viewcomment"]=id;
        if(num!=0){
            $state.go('app.comment');
        }
    };
    $scope.postcomment = function() {
        var msg_id= sessionStorage["comment"];
        var usuario = JSON.parse(sessionStorage["user"]);
        if($scope.Newcomment.text!=undefined){
            var text = $scope.Newcomment.text;
            $http.get(base_url+'/users/'+usuario.userid,{headers: {'x-access-token': usuario.token}}).success(function (data) {
                $http.post(base_url + "/comment/" + msg_id, {
                    username: data.username,
                    id: usuario.userid,
                    text: text,
                    imageUrl:data.imageUrl,
                    token: usuario.token
                }).success(function () {
                    getMyMessages();
                    $scope.Newcomment.text=null;
                    $scope.modal.hide();
                })
            });
        }
        else
        {
            $ionicPopup.alert({
                title: 'Error',
                content: 'Please fill the fields correctly'
            });
        }
    };
    $scope.Cancel= function () {
        $scope.modal.hide();
    };
    $scope.likeMenssage = function(id){
        var usuario = JSON.parse(sessionStorage["user"]);
        $http.post(base_url+"/message/" + id +"/like" , {token: usuario.token})
            .success(function (data, status, headers, config) {
                getMyMessages();
            })
            .error(function (error, status, headers, config) {
                console.log(error);
            });
    };
}]);