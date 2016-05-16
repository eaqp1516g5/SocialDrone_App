/**
 * Created by bernatmir on 15/5/16.
 */
angular.module('starter').controller('ItemController', function ($scope,$http,$state, $ionicFilterBar,$ionicModal, $timeout) {
    var filterBarInstance;
    $scope.showFilterBar = function () {
        filterBarInstance = $ionicFilterBar.show({
            items: $scope.items,
            update: function (filteredItems, filterText) {
                $scope.items = filteredItems;
                if (filteredItems) {
                    console.log($scope.items);
                }
            }//, filterProperties: 'username'
        });
    };
    $timeout(function () {
        getUsers();
        $scope.$broadcast('scroll.refreshComplete');
    }, 1000);

    function getUsers() {
        $http.get(base_url + '/users').success(function (data) {
            $scope.items = data;
        })
    }
    $scope.refreshItems = function () {
        if (filterBarInstance) {
            filterBarInstance();
            filterBarInstance = null;
        }
    };
    getUsers();
});