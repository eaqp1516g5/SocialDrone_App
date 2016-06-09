angular.module('starter').controller('searchCtrl', function($scope,$state,$ionicFilterBar, $stateParams,$location, $timeout, ionicMaterialMotion, ionicMaterialInk, $http) {
    var filterBarInstance;
    function getItems () {

        var items = [];
        $http.get(base_url + '/users').success(function (data) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.get(base_url + '/users/' + usuario._id, {headers: {'x-access-token': usuario.token}}).success(function (data) {
                console.log('mi usuario'+data);
            })
                for (var x = 0; x < data.length; x++) {
            items.push({text:data[x].username,email:data[x].mail,imageURL:data[x].imageUrl});
        }
        $scope.items = items;
            console.log($scope.items);
    })
    }
    $scope.onselect= function (username) {
        sessionStorage["userSearch"]=username;
        $state.go('app.usersearch');
    };

    getItems();
    $scope.showFilterBar = function () {
        var filterBarInstance = $ionicFilterBar.show({
            cancelText: "<i class='ion-ios-close-outline'></i>",
            items: $scope.items,
            update: function (filteredItems, filterText) {
                $scope.items = filteredItems;
            }
        });
    };
    $scope.refreshItems = function () {
        if (filterBarInstance) {
            filterBarInstance();
            filterBarInstance = null;
        }
    };
    $timeout(function () {
        getItems();
        $scope.$broadcast('scroll.refreshComplete');
    }, 1000);
});
