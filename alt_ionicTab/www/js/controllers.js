angular.module('SimpleRESTIonic.controllers', [])

    //Login Controller
    .controller('LoginCtrl', function (Backand, $state, $rootScope, LoginService,$ionicPopup) {
        var login = this;
     
        function signin() {
            LoginService.signin(login.email, login.password)
                .then(function () {
                    onLogin();
                }, function (error) {
                     var alertPopup = $ionicPopup.alert({
                         title: 'Login failed!',
                         template: 'Please check your credentials!'
                     });
                })
        }

        function anonymousLogin(){
            LoginService.anonymousLogin();
            onLogin();            
        }

        function onLogin(){
            $rootScope.$broadcast('authorized');
            $state.go('tab.dashboard');
        }

        function signout() {
            LoginService.signout()
                .then(function () {
                    //$state.go('tab.login');
                    $rootScope.$broadcast('logout');
                    $state.go($state.current, {}, {reload: true});
                })
        }
             
        login.signin = signin;
        login.signout = signout;
        login.anonymousLogin = anonymousLogin;
    })



.controller("ExampleController", function($scope, $rootScope, $ionicPlatform, $cordovaBeacon) {
 
    $scope.beacons = {};
 
    $ionicPlatform.ready(function() {
 
        $cordovaBeacon.requestWhenInUseAuthorization();
 
        $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
            var uniqueBeaconKey;
            for(var i = 0; i < pluginResult.beacons.length; i++) {
                uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":" + pluginResult.beacons[i].minor;
                $scope.beacons[uniqueBeaconKey] = pluginResult.beacons[i];
            }
            $scope.$apply();
        });
 
        $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("estimote", "2C96200F-07B9-422F-89B1-D7EC8EEB7CD7"));
 
    });
})


    //Register Controller
   .controller('RegisterCtrl', function (Backand, $state, $rootScope, RegisterService, $ionicPopup) {
       var register = this;     
    
       function createAccount() {
           
           if(register.password != register.repeatPassword){
               var alertPopup = $ionicPopup.alert({
                         title: 'Entered Passwords not equal!',
                         template: 'Please check entered passwords!'
                     });
           }
     //       RegisterService.createAccount(register.firstname, register.lastname, register.email, register.password)
    //            .then(function () {
    //                onCreate();
    //            }, function (error) {
    //                 var alertPopup = $ionicPopup.alert({
    //                     title: 'Login failed!',
    //                    template: 'Please check your credentials!'
    //                 });
    //            })
       }

//        function onCreate(){            
//             var alertPopup = $ionicPopup.alert({
//                title: 'Account created!',
//                template: 'Please login with your credentials!'
//             });
//          $state.go('login');
//        }
  })




//BeaconController 

    .controller('DashboardCtrl', function (ItemsModel, $rootScope) {
        var vm = this;

        function goToBackand() {
            window.location = 'http://docs.backand.com';
        }

        function getAll() {
            ItemsModel.all()
                .then(function (result) {
                    vm.data = result.data.data;
                });
        }

        function clearData(){
            vm.data = null;
        }

        function create(object) {
            ItemsModel.create(object)
                .then(function (result) {
                    cancelCreate();
                    getAll();
                });
        }

        function update(object) {
            ItemsModel.update(object.id, object)
                .then(function (result) {
                    cancelEditing();
                    getAll();
                });
        }

        function deleteObject(id) {
            ItemsModel.delete(id)
                .then(function (result) {
                    cancelEditing();
                    getAll();
                });
        }

        function initCreateForm() {
            vm.newObject = {name: '', description: ''};
        }

        function setEdited(object) {
            vm.edited = angular.copy(object);
            vm.isEditing = true;
        }

        function isCurrent(id) {
            return vm.edited !== null && vm.edited.id === id;
        }

        function cancelEditing() {
            vm.edited = null;
            vm.isEditing = false;
        }

        function cancelCreate() {
            initCreateForm();
            vm.isCreating = false;
        }

        vm.objects = [];
        vm.edited = null;
        vm.isEditing = false;
        vm.isCreating = false;
        vm.getAll = getAll;
        vm.create = create;
        vm.update = update;
        vm.delete = deleteObject;
        vm.setEdited = setEdited;
        vm.isCurrent = isCurrent;
        vm.cancelEditing = cancelEditing;
        vm.cancelCreate = cancelCreate;
        vm.goToBackand = goToBackand;
        vm.isAuthorized = false;

        $rootScope.$on('authorized', function () {
            vm.isAuthorized = true;
            getAll();
        });

        $rootScope.$on('logout', function () {
            clearData();
        });

        if(!vm.isAuthorized){
            $rootScope.$broadcast('logout');
        }

        initCreateForm();
        getAll();

    });



