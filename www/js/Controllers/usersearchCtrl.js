/**
 * Created by bernatmir on 15/5/16.
 */
angular.module('starter').controller('usersearchCtrl', function($scope,ionicMaterialInk, ionicMaterialMotion, $ionicModal, $ionicPopover, $timeout, $http,$ionicPopup, $state) {
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

    function getUserSearch(){
        var userSearched = sessionStorage["userSearch"];
        $scope.userSearched = userSearched;
        $http.get(base_url+'/api/user/'+userSearched).success(function (data) {
            $scope.usersearchedMail=data.mail;
            $scope.usersearchedImageUrl=data.imageUrl;
            getMyMessages(data._id);
            getNumFollowers(data._id);
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
            console.log('Numero de following'+data.length);
            $scope.numFollowing = data.length;
            $http.get(base_url+'/followers/'+userid).success(function (data) {
                $scope.numFollowers = data.length;
            }).error(function (err) {
                console.log(err)
            })
        })
    }
});