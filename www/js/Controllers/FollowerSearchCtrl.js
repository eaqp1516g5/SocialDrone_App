/**
 * Created by bernatmir on 15/5/16.
 */
angular.module('starter').controller('FollowerSearchCtrl', function($scope,ionicMaterialInk, ionicMaterialMotion, $ionicModal, $ionicPopover, $timeout, $http,$ionicPopup, $state) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    var miUsuario = JSON.parse(sessionStorage["user"]);
    var usersearched = sessionStorage["userSearch"];
    $scope.usersearched=usersearched;
    // Delay expansion
    $timeout(function () {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);
    $scope.userprofile = function (username) {
        sessionStorage["userSearch"] = username;
        $state.go('app.usersearch');

    };

    function getFollowers(){
        $http.get(base_url+'/api/user/'+usersearched).success(function (data) {
            $http.get(base_url + '/followers/' + data._id).success(function (data) {
                $scope.Followers = data;
            }).error(function (err) {
                console.log(err);
            })
        }).error(function (err) {
            console.log(err)
        });

    }
    getFollowers();
});