/**
 * Created by bernatmir on 15/5/16.
 */

angular.module('starter').controller('FollowingCtrl', function($scope,ionicMaterialInk, ionicMaterialMotion, $ionicModal, $ionicPopover, $timeout, $http,$ionicPopup, $state) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    var miUsuario = JSON.parse(sessionStorage["user"]);
    var userSearched = sessionStorage["userSearch"];
    function getFollowing(){
              $http.get(base_url + '/following/' + miUsuario.userid).success(function (data) {
                    $scope.Followings = data;
                }).error(function (err) {
                    console.log(err);
                })
    }
    getFollowing();

    $scope.userprofile= function (username) {
        sessionStorage["userSearch"]=username;
        $state.go('app.usersearch');

    };
    $scope.unfollow= function (username){
    $http({
        method: 'DELETE',
        url: base_url + '/unfollow/' + miUsuario.userid,
        data: {unfollow: username},
        headers: {'Content-Type': 'application/json'}
    }).success(function (data) {
        console.log(data);
        getFollowing();
    }).error(function (err) {
        console.log(err);
    })
    };
    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
});
