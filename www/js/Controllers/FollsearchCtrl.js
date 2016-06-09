/**
 * Created by bernatmir on 15/5/16.
 */
angular.module('starter').controller('FollsearchCtrl', function($scope,ionicMaterialInk, ionicMaterialMotion, $ionicModal, $ionicPopover, $timeout, $http,$ionicPopup, $state) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    var usersearched = sessionStorage["userSearch"];
    var miUsuario = JSON.parse(sessionStorage["user"])
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
        console.log(miUsuario+'este es el usuario');
        console.log(miUsuario.token+'este es el token');
        $http.get(base_url+'/users/'+miUsuario.userid, {headers: {'x-access-token': miUsuario.token}}).success(function (data) {
            console.log('la data del followers '+data);
            sessionStorage["userSearch"] = username;
            console.log(data.username+username);
            if(data.username==username)
                $state.go('app.profile');
            else
                $state.go('app.usersearch');
        });


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