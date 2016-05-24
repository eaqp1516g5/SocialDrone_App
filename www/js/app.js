// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic','ionic-modal-select','ion-autocomplete','btford.socket-io','jett.ionic.filter.bar', 'starter.controllers', 'ionic-material', 'ionMdInput','ngCordova', 'ngOpenFB', 'ngCordovaOauth'])

angular.module('starter', ['ionic','ionic-modal-select','ion-autocomplete','jett.ionic.filter.bar', 'starter.controllers','ionic-material', 'ionMdInput','ngCordova', 'ngOpenFB', 'ngCordovaOauth'])

.run(function($ionicPlatform, ngFB) {
    ngFB.init( {appId: '974844992601335'} );
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            $window.cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.

    state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.activity', {
        url: '/activity',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'ActivityCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })
        .state('app.search', {
            url: '/search',
            views: {
                'menuContent': {
                    templateUrl: 'templates/search.html',
                    controller: 'searchCtrl'
                },
                'fabContent': {
                    template: ''
                }
            }
        })
        .state('app.usersearch', {
            url: '/usersearch',
            views: {
                'menuContent': {
                    templateUrl: 'templates/usersearch.html',
                    controller: 'usersearchCtrl'
                },
                'fabContent': {
                    template: ''
                }
            }
        })
        .state('app.createmsg', {
            url: '/createmsg',
            views: {
                'menuContent': {
                    templateUrl: 'templates/createmsg.html',
                    controller: 'UpdatemsgCtrl'
                }/*,
                'fabContent': {
                    template: '<button id="fab-activity" ui-sref="app.createmsg" class="button button-fab button-fab-bottom-right expanded button-energized-900 flap"><i class="icon ion-paper-airplane"></i></button>',
                    controller: function ($timeout) {
                        $timeout(function () {
                            document.getElementById('fab-activity').classList.toggle('on');
                        }, 200);
                    }
                }*/
            }
        })
       
    .state('app.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/friends.html',
                controller: 'FriendsCtrl'
            },
            'fabContent': {
                template: '',
                controller: function ($timeout) {
                    $timeout(function () {
                    }, 900);
                }
            }
        }
    })

    .state('app.gallery', {
        url: '/gallery',
        views: {
            'menuContent': {
                templateUrl: 'templates/gallery.html',
                controller: 'GalleryCtrl'
            },
            'fabContent': {
                template: '<button id="fab-gallery" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-heart"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-gallery').classList.toggle('on');
                    }, 600);
                }
            }
        }
    })

    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })
        .state('app.logout', {
            
            views: {
                'menuContent': {
                    controller: 'LogoutCtrl'
                }
            }
        })

    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            },
            'fabContent': {
                template: ''
            }
        }
    })
        .state('app.add', {
            url: '/add',
            views: {
                'menuContent': {
                    templateUrl: 'templates/add.html',
                    controller: 'addCtrl'
                },
                'fabContent': {
                    template: ''
                }
            }
        })
        .state('app.following', {
            url: '/following',
            views: {
                'menuContent': {
                    templateUrl: 'templates/following.html',
                    controller: 'FollowingCtrl'
                },
                'fabContent': {
                    template: '<button id="fab-friends" class="button button-fab button-fab-top-left expanded button-energized-900 spin"><i class="icon ion-chatbubbles"></i></button>',
                    controller: function ($timeout) {
                        $timeout(function () {
                            document.getElementById('fab-friends').classList.toggle('on');
                        }, 900);
                    }
                }
            }
        })
        .state('app.followingSearch', {
            url: '/followingSearch',
            views: {
                'menuContent': {
                    templateUrl: 'templates/followingSearch.html',
                    controller: 'FollsearchCtrl'
                },
                'fabContent': {
                    template: '',
                    controller: function ($timeout) {
                        $timeout(function () {
                        }, 900);
                    }
                }
            }
        })
        .state('app.followerSearch', {
            url: '/followerSearch',
            views: {
                'menuContent': {
                    templateUrl: 'templates/followerSearch.html',
                    controller: 'FollowerSearchCtrl'
                },
                'fabContent': {
                    template: '',
                    controller: function ($timeout) {
                        $timeout(function () {
                        }, 900);
                    }
                }
            }
        })
        .state('app.followers', {
            url: '/followers',
            views: {
                'menuContent': {
                    templateUrl: 'templates/follower.html',
                    controller: 'FollowerCtrl'
                },
                'fabContent': {
                    template: '',
                    controller: function ($timeout) {
                        $timeout(function () {
                        }, 900);
                    }
                }
            }
        })
        .state('app.addevent', {
            url: '/addevent',
            views: {
                'menuContent': {
                    templateUrl: 'templates/addevent.html',
                    controller: 'addeventCtrl'
                }
            },
            'fabContent': {
                template: ''
            }
        })
        .state('app.showevents', {
            url: '/showevents',
            views: {
                'menuContent': {
                    templateUrl: 'templates/showevents.html',
                    controller: 'showeventCtrl'
                }
            }
        })
        .state('app.event', {
            url: '/event',
            views: {
                'menuContent': {
                    templateUrl: 'templates/event.html',
                    controller: 'eventCtrl'
                }
            }
        })
        .state('app.signup', {
            url: '/signup',
            views: {
                'menuContent': {
                    templateUrl: 'templates/signup.html',
                    controller: 'SignupCtrl'
                },
                'fabContent': {
                    template: ''
                }
            }
        });
    


    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/login');
});
