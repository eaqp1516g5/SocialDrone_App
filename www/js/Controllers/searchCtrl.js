angular.module('starter').controller('searchCtrl', function($scope,$state, $stateParams,$location, $timeout, ionicMaterialMotion, ionicMaterialInk, $http) {
    function getUsers() {
        $http.get(base_url + '/users').success(function (data) {
            $scope.items = data;
           var items = $scope.items;

        })
    }
    getUsers();
    $scope.callbackMethod = function (query, isInitializing) {
        return [query];
    }
});
