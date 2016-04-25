/* global angular, document, window */
'use strict';
var base_url = "http://localhost:8080";
angular.module('starter.controllers', [])
.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;

    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
})

.controller('LoginCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk,$state, $http,$ionicPopup) {
    $scope.$parent.clearFabs();
    $scope.loginUser={};
    $scope.currentUser={};
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();
    $scope.loginUser= function () {
        if ($scope.loginUser.username!=undefined && $scope.loginUser.password!=undefined){
            $http.post(base_url+'/authenticate',{
                username: $scope.loginUser.username,
                password: $scope.loginUser.password
            }).success(function (data) {
                if(data.success!=false) {
                    $scope.loginUser.username = null;
                    $scope.loginUser.password = null;
                    sessionStorage["user"] = JSON.stringify(data);
                    $state.go('app.profile');
                }
                else{
                    $ionicPopup.alert({
                        title: 'Error ',
                        content: data.message
                    });
                }
            }).error(function (error) {
                    console.log(error);
                });
        }
    };
})

    .controller("OauthExample", function($scope, $cordovaOauth) {

        $scope.googleLogin = function() {
            $cordovaOauth.google("CLIENT_ID_HERE", ["https://www.googleapis.com/auth/urlshortener", "https://www.googleapis.com/auth/userinfo.email"]).then(function(result) {
                console.log(JSON.stringify(result));
            }, function(error) {
                console.log(error);
            });
        }

    })
.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})
    
.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $http, $state) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');
    $scope.messages = {};
    $scope.message1 = {};
    $scope.editMessage = {};
    $scope.info = {};
    $scope.newMessage = {};
    $scope.usuar = {};
    $scope.ed={};
    $scope.editando = function(se){
        sessionStorage["msg"]=JSON.stringify(se);
        $state.go('app.createmsg');
    }

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);
    getMessage();
    $scope.likeMenssage = function(id){
        $http.post(base_url+"/message/" + id +"/like" , {token: $scope.usuar.token})
            .success(function (data, status, headers, config) {
                getMessage();
            })
            .error(function (error, status, headers, config) {
                console.log(error);
            });
    }
    $scope.borrarMensaje = function (id) {
        if(sessionStorage["user"]!=undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.delete(base_url + "/message/" + id, {headers: {'x-access-token': $scope.usuar.token}})
                .success(function (data, status, headers, config) {
                    getMessage();
                })
                .error(function (error, status, headers, config) {
                    console.log(err);
                });
        }
    }
    $scope.enviarMensaje = function(id) {
        if(sessionStorage["user"]!=undefined) {
            var usuario = JSON.parse(sessionStorage["user"]);
            if (id == undefined) {
                $http.post(base_url + "/message", {
                        username: usuario.userid,
                        text: $scope.newMessage.message,
                        token: usuario.token
                    })
                    .success(function (data, status, headers, config) {
                        getMessage();
                        text: $scope.newMessage.message=null;
                        console.log(data);
                    })
                    .error(function (error, status, headers, config) {
                        console.log(error);
                    });
            } else {
                $http.post(base_url + "/comment/" + id, {
                        username: $scope.info.username,
                        id: usuario.userid,
                        text: $scope.newComment.message,
                        token: usuario.token
                    })
                    .success(function (data, status, headers, config) {
                        $http.get(base_url + "/message/" + id) //hacemos get de todos los users
                            .success(function (data) {
                                $scope.message1 = data;
                                $scope.comment = data.comment;
                                $scope.newComment.message = null;
                                console.log(data);
                                getMessage();
                            })
                            .error(function (err) {
                                console.log(err);
                            });
                    })
                    .error(function (error, status, headers, config) {
                        console.log(error);
                    });
            }
        }
    };
    function getMessage() {
        if (sessionStorage["user"] != undefined)
            $scope.usuar = JSON.parse(sessionStorage["user"]);
        $http.get(base_url + "/message") //hacemos get de todos los messages.js
            .success(function (data) {
                $scope.messages = data;
                $http.get(base_url + '/users/' + $scope.usuar.userid, {headers: {'x-access-token': $scope.usuar.token}})
                    .success(function (data) {
                        $scope.info = data;
                    })
                    .error(function (err) {
                    });
            })
            .error(function (err) {
                console.log(err);
            });
    }
    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})
    .controller('UpdatemsgCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $http, $state) {
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
        $scope.$parent.setHeaderFab('right');
        $scope.message = {};
        $scope.editMessage = {};
        $scope.usuar = {};

        $scope.updateMessage = function (id) {
            $http.put(base_url+'/message/'+id,{
                text: $scope.editMessage.text,
                token: $scope.usuar.token
            }).success(function () {
                    $state.go('app.activity');
                    $scope.editMessage.text=null;
                })
                .error(function (error, status, headers, config) {
                    console.log(error);
                });
        };

        $timeout(function() {
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in .item'
            });
        }, 200);
        getMessage();
        function getMessage() {
            $scope.usuar = JSON.parse(sessionStorage["user"]);
            $scope.message=JSON.parse(sessionStorage["msg"])
        }
        // Activate ink for controller
        ionicMaterialInk.displayEffect();
    })

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})

;
