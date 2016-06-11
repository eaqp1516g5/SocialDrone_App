/**
 * Created by bernatmir on 15/5/16.
 */
angular.module('starter').controller('usersearchCtrl', function($scope,ionicMaterialInk, ionicMaterialMotion, $ionicModal, $ionicPopover, $timeout, $http,$ionicPopup, $state) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);
    var miUsuario = JSON.parse(sessionStorage["user"]);
    $scope.usuar= miUsuario;
    var userSearched = sessionStorage["userSearch"];
    $scope.Newcomment={};
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
    $scope.userSearch={};
    function getUserSearch(){
        $scope.userSearched = userSearched;
        $http.get(base_url+'/api/user/'+userSearched).success(function (data) {
            $scope.usersearchedMail=data.mail;
            $scope.usersearchedImageUrl=data.imageUrl;
            $scope.userSearch=data;
            var us = data._id;
            getMyMessages(data._id);
            getNumFollowers(data._id);
            $http.get(base_url+'/users/'+miUsuario.userid, {headers: {'x-access-token': miUsuario.token}}).success(function (data) {
                if(data.username!=userSearched){
                    console.log('entro en el isfollowing');
                    isFollowing(miUsuario.userid, us);
                }
                else
                    $scope.myself=true;
            }).error(function(err){
                console.log(err);
            })

        }).error(function (err) {
            console.log(err)
        })
    }
    getUserSearch();
    function getMyMessages (userid){
        console.log('Mi userid +'+userid);
            $http.get(base_url+'/message/user/'+userid).success(function (data) {
                console.log(data);
                $scope.messages=data;
            }).error(function (err) {
                console.log(err)
            });
    }
    $scope.initChat = function (id) {
        $http.post(base_url+'/chatt', {
            token: miUsuario.token,
            user: $scope.userSearch._id,
            userid: miUsuario.userid
        }).success(function (data) {
            sessionStorage['conver']=JSON.stringify(data);
            $state.go('app.chat');
        }).error(function (err) {
            console.log(err)
        });
    };
    $scope.likes=function(id, likes){
        var li = false;
        for(var i = 0; i<likes.length; i++){
            if(likes[i]==id){
                li=true;
            }
        }
        return li;
    }
    $scope.likeMenssage = function(id){
        $http.post(base_url+"/message/" + id +"/like" , {token: miUsuario.token, userid: miUsuario.userid})
            .success(function (data, status, headers, config) {
                getMyMessages($scope.userSearch._id);
            })
            .error(function (error, status, headers, config) {
                console.log(error);
            });
    };
    $scope.dislikeMessage=function(id){
        $http.delete(base_url + "/message/" + id + "/dislike",  {headers: {'x-access-token': miUsuario.token, userid:  miUsuario.userid}})
            .success(function (data, status, headers, config) {
                getMyMessages($scope.userSearch._id);
            })
            .error(function (error, status, headers, config) {
            });
    }
    $scope.following= function (numFollowing) {
        if(numFollowing!=0)
        $state.go("app.followingSearch");
    };
    $scope.followers= function (numFollowers) {
        if(numFollowers!=0)
            $state.go("app.followerSearch");
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
    function getNumFollowers(userid){
        $http.get(base_url+'/following/'+userid).success(function (data) {
            $scope.numFollowing = data.length;
            $http.get(base_url+'/followers/'+userid).success(function (data) {
                $scope.numFollowers = data.length;
            }).error(function (err) {
                console.log(err)
            })
        })
    }
    function isFollowing(miId, userid){
        $http.get(base_url+'/following/'+miId+'/'+userid).success(function (data) {
            if(data=="No sigues")
                $scope.nolosigues=true;
            else
                $scope.nolosigues=false;

            console.log($scope.nolosigues+'No lo sigues?');

        }).error(function (err) {
            console.log(err)
        });

    }
    $scope.letunfollow= function () {

        $http.get(base_url+'/users/'+miUsuario.userid, {headers: {'x-access-token': miUsuario.token}}).success(function (data) {
            $http({
                method: 'DELETE',
                url: base_url + '/unfollow/' + miUsuario.userid,
                data: {unfollow: userSearched},
                headers: {'Content-Type': 'application/json'}
            }).success(function (data) {
                console.log(data);
                getUserSearch()
            }).error(function (err) {
                console.log(err);
            })
        }).error(function (err) {
            console.log(err);
        })
    };
    $scope.letfollow= function () {

        $http.get(base_url+'/users/'+miUsuario.userid, {headers: {'x-access-token': miUsuario.token}}).success(function (data) {
            $http.post(base_url+'/follow/'+miUsuario.userid, {
                follow:userSearched
            }).success(function (data) {
                getUserSearch();
                //socket.emit('follow',user, function(data){})
            }).error(function (err) {
                console.log(err)
            });
        }).error(function (err) {
            console.log(err)
        });
    };
    $scope.showcomments= function (num,id) {
        sessionStorage["viewcomment"]=id;
        if(num!=0){
            $state.go('app.comment');
        }
    };
    $scope.showPopup = function(id) {
        var us;
        $scope.userSearched = userSearched;
        $http.get(base_url+'/api/user/'+userSearched).success(function (data) {
             us = data._id;
        })
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
                                $http.get(base_url+'/users/'+miUsuario.userid,{headers: {'x-access-token': miUsuario.token}}).success(function (data) {
                                    $http.post(base_url + "/comment/" + msg_id, {
                                        username: data.username,
                                        id: miUsuario.userid,
                                        text: text,
                                        imageUrl:data.imageUrl,
                                        token: miUsuario.token
                                    }).success(function () {
                                        $scope.Newcomment.text=null;
                                        myPopup.close();
                                        getMyMessages(us);
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
});