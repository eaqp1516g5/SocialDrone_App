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
    var userSearched = sessionStorage["userSearch"];
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

    function getUserSearch(){
        $scope.userSearched = userSearched;
        $http.get(base_url+'/api/user/'+userSearched).success(function (data) {
            $scope.usersearchedMail=data.mail;
            $scope.usersearchedImageUrl=data.imageUrl;
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
    $scope.following= function (numFollowing) {
        if(numFollowing!=0)
        $state.go("app.followingSearch");
    };
    $scope.followers= function (numFollowers) {
        if(numFollowers!=0)
            $state.go("app.followerSearch");
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
});