/**
 * Created by bernat on 17/04/16.
 */

angular.module('starter').controller('ProfileCtrl', ['$scope','$state', '$stateParams','$location', '$timeout', 'ionicMaterialMotion', 'ionicMaterialInk', '$http', '$ionicPopup','$ionicModal', '$ionicPopover','socketio','$sce', function($scope,$state, $stateParams,$location, $timeout, ionicMaterialMotion, ionicMaterialInk, $http, $ionicPopup,$ionicModal, $ionicPopover,$sce,socket) {
    $scope.users={};
    $scope.myUser={};
    $scope.us={};
    $scope.currentUser={};
    $scope.messages={};
    $scope.newMessage={};
    $scope.Newcomment={};
    $scope.nomore=true;
    $scope.page=0;
    $scope.updateUser={};
    var usuario = JSON.parse(sessionStorage["user"]);
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
    $scope.flag = false;
    getMyMessages();
    function getMyMessages (){
        $scope.nomore=true;
        $scope.page=0;
        if (sessionStorage["user"] != undefined) {
            $http.get(base_url+'/message/user/'+usuario.userid+'/page='+$scope.page).success(function (data) {
                console.log('los mensajes')
                console.log(data);
                $scope.messages=data;
                var spl;
                console.log('$scope.messages' + $scope.messages);
                for (var i = 0; i < data.length; i++) {
                    var str = data[i].text;
                    if (str.search("youtube.com") != -1) {
                        $scope.messages[i].youtube=true;
                        console.log('$scope.messages2' + $scope.messages);
                        console.log(data[i]+' es un video de youtube');
                        var pl = str.split(" ");
                        for (var x = 0; x < pl.length; x++) {
                            if (pl[x].search("youtube.com") != -1) {
                                spl = pl[x].split("=")[1];
                                data[i].video = "https://www.youtube.com/embed/" +spl;
                            }
                        }
                    }
                    else{
                        $scope.messages[i].youtube=false;
                    }
                    console.log($scope.messages);
                    console.log('$scope.messages[i]'+$scope.messages.youtube+'el mensaje '+data[i].text);
                }
                $scope.page=$scope.page+1;
                $scope.flag = true;
                console.log($scope.page+'get my message pagination');
                })

            }
        }
    $scope.nomore=true;

    $scope.loadMore = function() {
        console.log($scope.flag);
        if($scope.flag)
        {
            $http.get(base_url + '/message/user/' + usuario.userid + '/page=' + $scope.page)
                .success(function (data) {
                        for (var i = 0; i < data.length; i++) {
                            console.log(data[i]);
                            if (data[i] != undefined) {
                                console.log('los mensajeeeeessss');
                                console.log($scope.messages);
                                    var spl;
                                    var str = data[i].text;
                                console.log(str+'str');
                                console.log('la i vale '+i);
                                console.log('entro1');
                                    if (str.search("youtube.com") != -1) {
                                        console.log('entro2');
                                        console.log('en el mensaje añado');
                                        console.log($scope.messages[i]);
                                        data[i].youtube=true;
                                        var pl = str.split(" ");
                                        for (var x = 0; x < pl.length; x++) {
                                            if (pl[x].search("youtube.com") != -1) {
                                                spl = pl[x].split("=")[1];
                                                data[i].video = "https://www.youtube.com/embed/" +spl;

                                            }
                                        }
                                        $scope.messages.push(data[i]);
                                        console.log('mis mensajeeeeessss');
                                        console.log($scope.messages);
                                        console.log(data[i]+' es un video de youtube');
                                    }
                                    else {
                                        console.log('entro3')
                                        console.log('no es un video');
                                        data[i].youtube = false;
                                        $scope.messages.push(data[i]);
                                    }
                            }

                            console.log($scope.messages);
                            console.log('$scope.messages[i]'+ $scope.messages.youtube +'el mensaje '+data[i].text);
                        }
                    if(data.length!=0) {
                        $scope.page = $scope.page + 1;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                    else{
                        $scope.nomore = false;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }

                })
                .error(function (err) {
                    console.log(err + 'errorrr');
                    $scope.nomore = false;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
        }
    }
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
    };
    $scope.showConfirm = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Consume Ice Cream',
            template: 'Are you sure you want to eat this ice cream?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                console.log('You are sure');
            } else {
                console.log('You are not sure');
            }
        });
    };
    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.updatemail= function () {
        if($scope.updateUser.email==undefined) {
            $ionicPopup.alert({
                title: 'Error',
                content: 'Please introduce a valid mail'
            });
        }
        else {
            console.log($scope.userName);
                $http.put(base_url+'/usersm/'+$scope.userName,{
                    email:$scope.updateUser.email
                }).success(function () {
                    $scope.updateUser.email=null;
                    $http.get(base_url + '/users/' + usuario.userid, {headers: {'x-access-token': usuario.token}}).success(function (data) {
                        sessionStorage["miUser"] = JSON.stringify(data);
                        $scope.userMail = data.mail;
                    });
                    $ionicPopup.alert({
                        title: 'Perfect',
                        content: 'Mail updated'
                    });
                })
        }
    };

    $scope.updatepass= function () {
        if($scope.updateUser.oldpass==undefined ||$scope.updateUser.newpass==undefined || $scope.updateUser.newpass2==undefined ){
            $ionicPopup.alert({
                title: 'Error',
                content: 'Please fill your old and new passwords'
            });
        }
        else if($scope.updateUser.newpass!=$scope.updateUser.newpass2){
            $ionicPopup.alert({
                title: 'Error',
                content: 'Your new passwords does not match'
            });
        }
        else{
           $http.put(base_url+'/users/password/'+$scope.userName,{
               password:$scope.updateUser.oldpass,
               password1:$scope.updateUser.newpass
           }).success(function (data) {
               console.log(data);
               $ionicPopup.alert({
                   title: 'Perfect',
                   content: 'Updated password'
               });
               $scope.updateUser.oldpass=null;
               $scope.updateUser.newpass=null;
               $scope.updateUser.newpass2=null;
           }).error(function (err) {
               $ionicPopup.alert({
                   title: 'Error',
                   content: 'Old password error'
               });
               $scope.updateUser.oldpass=null;
           })
        }
    };
    $scope.borrarMensaje = function (id) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete message',
            template: 'Are you sure you want to delete this message?'
        });
        confirmPopup.then(function(res) {
            if(res) {
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
            } else {
                console.log('You are not sure');
            }
        });

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
                        $ionicPopup.alert({
                            title: 'Error ',
                            content: 'Please introduce your message correctly'
                        });
                    });
            } else {
                $http.post(base_url + "/comment/" + id, {
                        username: $scope.info.username,
                        id: usuario.userid,
                        text: $scope.newComment.message,
                        token: usuario.token
                    })
                    .success(function (data, status, headers, config) {
                        $http.get(base_url + "/message/" + id)
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
    $scope.showPopup = function(id) {
        $scope.data = {};
        var msg_id=id;
        // An elaborate, custom popup
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="Newcomment.text">',
            title: 'Comment',
            subTitle: 'Enter your text',
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Comment</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!$scope.Newcomment.text) {
                            //don't allow the user to close unless he enters wifi password
                            e.preventDefault();
                        } else {
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
                                        $scope.Newcomment.text=null;
                                        myPopup.close();
                                        getMyMessages();
                                    })
                                });
                            }
                        }
                    }
                }
            ]
        });
        myPopup.then(function(res) {
            console.log('Tapped!', res);
        });
        $timeout(function() {
            myPopup.close(); //close the popup after 3 seconds for some reason
        }, 6000);
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