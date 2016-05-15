/**
 * Created by bernatmir on 15/5/16.
 */
angular.module('starter').controller('FollsearchCtrl', function($scope,ionicMaterialInk, ionicMaterialMotion, $ionicModal, $ionicPopover, $timeout, $http,$ionicPopup, $state) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    var usersearched = sessionStorage["userSearch"];
    $scope.usersearched = usersearched;
    function getFollowing(){
        $http.get(base_url+'/api/user/'+usersearched).success(function (data) {
            $http.get(base_url + '/following/' + data._id).success(function (data) {
                $scope.Followings = data;
            }).error(function (err) {
                console.log(err);
            })
        }).error(function (err) {
            console.log(err)
        });

    }
    getFollowing();
    $scope.userprofile= function (username) {
        sessionStorage["userSearch"]=username;
        $state.go('app.usersearch');

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