/* global angular, document, window */
'use strict';
var base_url = "http://localhost:8080";
angular.module('starter.controllers', ['ngOpenFB'])
.controller('AppCtrl', function($scope,$http, $ionicModal, $ionicPopover, $timeout,$ionicFilterBar) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.usuar = {};
    $scope.hasHeaderFabRight = false;



        var navIcons = document.getElementsByClassName('ion-navicon');
        for (var i = 0; i < navIcons.length; i++) {
            navIcons.addEventListener('click', function () {
                this.classList.toggle('active');
            });
        }
    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function () {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };
    $scope.showNavBar = function () {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
        var usuario = JSON.parse(sessionStorage["user"]);
        $http.get(base_url + '/users/' + usuario.userid, {headers: {'x-access-token': usuario.token}}).success(function (data) {
            $scope.userFoto = data.imageUrl;
            $scope.userName = data.username;
            $scope.userMail = data.mail;
            $http.get(base_url + '/following/' + usuario.userid).success(function (data) {
                console.log('Numero de following' + data.length);
                $scope.numFollowing = data.length;
                $http.get(base_url + '/followers/' + usuario.userid).success(function (data) {
                    $scope.numFollowers = data.length;
                }).error(function (err) {
                    console.log(err)
                })
            }).error(function (err) {
                console.log(err)
            })
        });
    };

    $scope.noHeader = function () {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function (bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function (location) {
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

    $scope.hasHeader = function () {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function () {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function () {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function () {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
})

    .controller('LogoutCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk,$state, $http){
        
        function logout() {
            var usuario = JSON.parse(sessionStorage["user"]);
            $http.delete(base_url + '/authenticate/' + usuario._id, {headers: {'x-access-token': usuario.token}}).success(function (data) {
                console.log(data)
                $state.go('app.login');
            }).error(function (err) {
                console.log(err)
            })
        }
        logout();
    })
.controller('LoginCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk,$state, $http,$ionicPopup, ngFB, $cordovaOauth) {
    $scope.$parent.clearFabs();
    $scope.loginUser={};
    $scope.currentUser={};
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();
    $scope.loginFB=function () {
        ngFB.login({scope: 'email,publish_actions'}).then(function (response) {
            console.log(sessionStorage['fbAccessToken']);
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                ngFB.api({
                    path: '/me',
                    params: {fields: 'id,name,email'}
                }).then(
                    function (user) {
                        var userFB = {
                            id_facebook: user.id,
                            username: user.name,
                            mail: user.email,
                            imageUrl: 'http://graph.facebook.com/'+user.id +'/picture?width=270&height=270',
                            usuarioSocial: 'facebook'
                        };
                        $http.post(base_url + '/users', userFB).success(function (data){
                            var session = {
                                token: sessionStorage['fbAccessToken'],
                                idFB:user.id,
                                userid:data._id
                            };
                          
                            $http.post(base_url + '/ionic/token',session).success(function (data) {
                                sessionStorage["user"]=JSON.stringify(session);
                                $state.go('app.profile');
                            }).error(function (err) {
                                console.log(err)
                            });
                            
                        }).error(function (data,err) {
                            console.log(err);
                            console.log(data[0]._id);
                            var sessionEx = {
                                token: sessionStorage['fbAccessToken'],
                                idFB:user.id,
                                userid:data[0]._id
                            };
                          
                            $http.post(base_url + '/ionic/token',sessionEx).success(function (data) {
                                console.log('Todo correcto y guardo el token');
                                sessionStorage["user"]=JSON.stringify(sessionEx);
                                $state.go('app.profile');
                            }).error(function (err) {
                                console.log(err)
                            });
                        });
                        
                       // $scope.user = userFB;
                        
                    },
                    function (error) {
                        alert('Facebook error: ' + error.error_description);
                    });
                
                
            } else {
                alert('Facebook login failed');
            }
        });
    };
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
    .controller('addeventCtrl', function($scope, $cordovaGeolocation,$state, $http) {
        var options = {timeout: 10000, enableHighAccuracy: true};
        $scope.event={};
        var marker;
        $cordovaGeolocation.getCurrentPosition(options).then(function(position){
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
                google.maps.event.addListener($scope.map, 'click', function(event){
                    if (marker==undefined) {
                        placeMarker(event.latLng, $scope.map);
                    }
                    else{
                        marker.setMap(null);
                        placeMarker(event.latLng, $scope.map);
                    }
                });
        }, function(error){
            console.log("Could not get location");
        });
        function placeMarker(location, ma){
            marker=new google.maps.Marker({
                position: location,
                map: ma
            })
            $scope.event.lat= location.lat();
            $scope.event.long=location.lng();
            sessionStorage["addevent"]=JSON.stringify($scope.event);
            ma.panTo(location);

        };
        $scope.add=function(){
            if(marker!=undefined)
                $state.go('app.add');
        }
    })
    .controller('showeventCtrl', function($scope, $cordovaGeolocation,$state, $http, $compile) {
        var options = {timeout: 10000, enableHighAccuracy: true};
        var base_url = "http://localhost:8080";
        $scope.show={};
        $scope.position={};
        $scope.show.km=0;
        $scope.markers=[];
        $scope.id={};
        var draw_circle;
        var center = new google.maps.LatLng(51,-0.12);
        var mapa;
        var zoom = 8;
        var marker;
        var infoWindow;
        $scope.initialize=function(){
            var input = document.getElementById('search');
            var autocomplete = new google.maps.places.Autocomplete(input);
            autocomplete.addListener('place_changed', function() {
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    window.alert("Autocomplete's returned place contains no geometry");
                    return;
                }
                expandViewportToFitPlace(place);

            });
            function expandViewportToFitPlace(place) {
                    $scope.createmap(place.geometry.location.lat(), place.geometry.location.lng());
            }


        };
        var createMarker = function (info){

            marker = new google.maps.Marker({
                map: $scope.map,
                position: new google.maps.LatLng(info.lat, info.long),
                icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
            });
            (function(marker, info){
                google.maps.event.addListener(marker, 'click', function() {
                    if(!infoWindow){
                        infoWindow=new google.maps.InfoWindow;
                    }
                    $scope.id=info._id;
                    var content= $compile('<button class="button button-clear button-positive" ng-click="see()">See event</button>')($scope);
                    infoWindow.setContent(content[0]);
                    infoWindow.open($scope.map,marker);
                });
            })(marker, info);

            $scope.markers.push(marker);

        };
        $scope.see=function() {
            console.log($scope.id);
            $http.get(base_url + "/event/" + $scope.id)
                .success(function (data, status, headers, config) {
                    console.log("hola a todos me largo");
                    console.log(data);
                    sessionStorage["eventoid"]=JSON.stringify(data);
                    console.log( sessionStorage["eventoid"]);
                    $state.go('app.event');
                })
                .error(function (error, status, headers, config) {
                    console.log(error);
                });
        };
        $scope.openInfoWindow = function(e, selectedMarker){
            e.preventDefault();
            google.maps.event.trigger(selectedMarker, 'click');
        };
        function setMapOnAll(map) {
            for (var i = 0; i < $scope.markers.length; i++) {
                $scope.markers[i].setMap(map);
            }
        }
        $scope.initialize();
        $scope.createmap= function (lat, long) {
            $scope.position= new google.maps.LatLng(lat,long);
            var mapOptions = {
                center: new google.maps.LatLng(lat,long),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new google.maps.Map(document.getElementById("mapa"), mapOptions);
            var mark=new google.maps.Marker({
                position: new google.maps.LatLng(lat,long),
                map: $scope.map
            })
        }
        $scope.mylocation=function() {
            $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
                $scope.createmap(position.coords.latitude, position.coords.longitude);
            }, function (error) {
                console.log("Could not get location");
            });
        }
        $scope.search =function() {
            if (marker != undefined) {
                setMapOnAll(null);
                draw_circle.setMap(null);
            }
            if (draw_circle!=undefined){
                draw_circle.setMap(null);
            }
            draw_circle = new google.maps.Circle({
                center: $scope.position,
                radius: $scope.show.km*1000,
                strokeColor: "#1E90FF",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#00BFFF",
                fillOpacity: 0.35,
                map: $scope.map
            });
            $http.post(base_url + "/events", {
                    lat: $scope.position.lat(),
                    lng: $scope.position.lng(),
                    radius: $scope.show.km
                })
                .success(function (data, status, headers, config) {
                    console.log(data);
                    for (var i = 0; i < data.length; i++){
                        createMarker(data[i]);
                    }
                })
                .error(function (error, status, headers, config) {
                    console.log(error);
                });
        };

    })
    .controller('addCtrl', function($scope, $cordovaGeolocation,$state, $http) {
        var options = {timeout: 10000, enableHighAccuracy: true};
        $scope.event={};
        var a= new Date();
        var d = new Date(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes());
        $scope.time = d;
        var marker;
        $scope.user={};
        $scope.getuser=function(){
            if(sessionStorage["user"]!=undefined){
                $scope.user=JSON.parse(sessionStorage["user"]);
            }
        };
        $scope.getuser();
        var coord = JSON.parse(sessionStorage["addevent"]);
        $scope.event.lat=coord.lat;
        $scope.event.long=coord.long;
        $scope.sendEvent=function(y) {
            {
                {
                    if (sessionStorage["user"] != undefined)
                        if ($scope.event.name != undefined && $scope.event.description != undefined && $scope.event.lat != undefined && $scope.event.long != undefined) {
                            $http.post(base_url + '/event', {
                                name: $scope.event.name,
                                description: $scope.event.description,
                                lat: $scope.event.lat,
                                long: $scope.event.long,
                                Date: y,
                                token: $scope.user.token,
                                userid: $scope.user.userid,
                                hour: ("0" + y.getHours()).slice(-2) + ":" + ("0" + y.getMinutes()).slice(-2),
                                location: [$scope.event.long, $scope.event.lat]
                            }).success(function (data) {
                                console.log(data);
                                sessionStorage["eventoid"] = JSON.stringify(data);
                                $state.go('app.event');
                            }).error(function (error, status, headers, config) {
                                console.log(error);
                            });
                        }
                }
            }};
            $scope.cancel = function () {
                $state.go('app.profile');
            };
        })
    .controller('eventCtrl', function($scope, $cordovaGeolocation,$state, $http) {
        var base_url = "http://localhost:8080";
        $scope.object={};
        $scope.show={};
        $scope.user={};
        $scope.go={};
        $scope.getobject=function(){
            console.log(sessionStorage["eventoid"]);
            if(sessionStorage["eventoid"]!=undefined){
                if(sessionStorage["user"]!=undefined){
                    $scope.user=JSON.parse(sessionStorage["user"]);
                }
                var object =JSON.parse(sessionStorage["eventoid"]);
                $http.get(base_url + '/event/' + object._id)
                    .success(function (data) {
                        console.log(data);
                        $scope.object=data;
                        for(var i = 0; i<data.go.length; i++){
                            if($scope.user!={}){
                                console.log(data.go[i]);
                                if($scope.user.userid==data.go[i]){
                                    $scope.show.id=data.go[i];
                                    console.log("esta");
                                }
                            }
                        }
                        $http.get(base_url+'/eve/'+object._id
                        ).success(function (data) {
                            $scope.go=data;
                        }).error(function (error, status, headers, config) {
                            console.log(error);
                        });
                    })
                    .error(function (err) {
                        console.log('Oh, something wrong');
                    });
            }
            else $state.go('app.profile');
        }
        $scope.getobject();
        $scope.goto=function(){
            $http.post(base_url+'/event/'+$scope.object._id,{
                token:  $scope.user.token,
                userid:  $scope.user.userid
            }).success(function (data) {
                console.log(data);
                if(data!="No tengo tokencito"){
                    $scope.object=data;
                    sessionStorage["eventoid"]=JSON.stringify(data);
                    $scope.show.id=$scope.user.userid;
                    $http.get(base_url+'/eve/'+$scope.object._id
                    ).success(function (data) {
                        $scope.go=data;
                    }).error(function (error, status, headers, config) {
                        console.log(error);
                    });
                }else console.log(data);
            }).error(function (error, status, headers, config) {
                console.log(error);
            });
        };
        $scope.dontgoto=function(){
            $http.post(base_url+'/goto/delete/'+$scope.object._id,{
                token:  $scope.user.token,
                userid:  $scope.user.userid
            }).success(function (data) {
                console.log(data);
                if(data!="No tengo tokencito"){
                    sessionStorage["eventoid"]=JSON.stringify(data);
                    $scope.object=data;
                    $scope.show.id=undefined;
                    $http.get(base_url+'/eve/'+$scope.object._id
                    ).success(function (data) {
                        $scope.go=data;
                    }).error(function (error, status, headers, config) {
                        console.log(error);
                    });
                }else console.log(data);
            }).error(function (error, status, headers, config) {
                console.log(error);
            });
        }
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
    };

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
    };
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
    };
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
