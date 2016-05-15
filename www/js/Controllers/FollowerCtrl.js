/**
 * Created by bernatmir on 15/5/16.
 */
angular.module('starter').controller('FollowerCtrl', function($scope,ionicMaterialInk, ionicMaterialMotion, $ionicModal, $ionicPopover, $timeout, $http,$ionicPopup, $state) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    var miUsuario = JSON.parse(sessionStorage["user"]);
    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);
    $scope.userprofile= function (username) {
        sessionStorage["userSearch"]=username;
        $state.go('app.usersearch');

    };
    function getFollowers(userid) {
        $http.get(base_url+'/followers/'+miUsuario.userid).success(function (data) {
            $scope.Followers=data;
        }).error(function (err) {
            console.log(err)
        })
    }
    getFollowers();
    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
});