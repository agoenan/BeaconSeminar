// Ionic template App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'BeaconApp' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('BeaconApp', ['ionic', , 'ngCordovaBeacon','backand', 'BeaconApp.userManagementControllers','BeaconApp.beaconControllers','BeaconApp.itemControllers',
                             'BeaconApp.services', 'BeaconApp.itemServices', 'BeaconApp.userManagementServices']) 

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
    })
    .config(function (BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {

        // change here to your appName
        var appName = 'beaconapp';

        // token is for anonymous login. see http://docs.backand.com/en/latest/apidocs/security/index.html#anonymous-access
        var token = '86d665e8-bb1c-4290-a124-2a80baac405d';

        BackandProvider.setAppName(appName);
        BackandProvider.setSignUpToken('da99c01e-2527-4709-a740-7bf76646f21b');
        BackandProvider.setAnonymousToken('89f171c1-8fee-4375-881c-facd3f273101');

        $stateProvider
            // setup an abstract state for the tabs directive
        
             .state('login', {
              url: '/login',
              templateUrl: 'templates/login.html',
              controller: 'LoginCtrl as login'
            })
        
             .state('register', {
              url: "/register",
              templateUrl: "templates/register.html"
          //    controller: 'RegisterCtrl as register'
            })

            .state('tab', {
                url: '/tabs',
                abstract: true,
                templateUrl: 'templates/tabs/tabs.html'
            })
        
            .state('tab.dashboard', {
                url: '/dashboard',
                views: {
                    'tab-dashboard': {
                        templateUrl: 'templates/tabs/tab-dashboard.html',
                        controller: 'DashboardCtrl as vm'
                    }
                }
            })
        
         .state('tab.nearBeacons', {
                url: '/nearBeacons',
                views: {
                    'tab-nearBeacons': {
                        templateUrl: 'templates/tabs/tab-nearBeacons.html',
                        controller: 'BeaconCtrl'
                    }
                }
            })
           
        ;

        $urlRouterProvider.otherwise('/login');

        $httpProvider.interceptors.push('APIInterceptor');
    })

    .run(function ($rootScope, $state, LoginService, Backand) {

        function unauthorized() {
            console.log("user is unauthorized, sending to login");
            $state.go('login');
        }

        function signout() {
            LoginService.signout();
        }

        $rootScope.$on('unauthorized', function () {
            unauthorized();
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            if (toState.name == 'login') {
                signout();
            }
            else if (toState.name != 'login' && Backand.getToken() === undefined) {
                unauthorized();
            }
        });

    })

