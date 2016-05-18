angular.module('BeaconApp.userManagementControllers', [])

    //Login Controller
    .controller('LoginCtrl', function (Backand, $state, $rootScope, LoginService,$ionicPopup) {
        var login = this;
     
        function signin() {
            
            //for dev purposes
             onLogin();
                   
            
            //productive version
       //     LoginService.signin(login.email, login.password)
       //            .then(function () {
       //                onLogin();
       //            }, function (error) {
       //                 var alertPopup = $ionicPopup.alert({
       //                     title: 'Login failed!',
       //                     template: 'Please check your credentials!'
       //                 });
       //            })
            
            
            
             cordova.plugins.locationManager.isBluetoothEnabled().then(function(booleanEnabledfromNativeLayer){
                if (booleanEnabledfromNativeLayer) {
                    return;
                } else {
	            cordova.plugins.locationManager.enableBluetooth(); 
	             var alertPopup = $ionicPopup.alert({
                         title: 'Info!',
                         template: 'Bluetooth is activated now!'
                     });
                }
            })
        }

        function anonymousLogin(){
            LoginService.anonymousLogin();
            onLogin();            
        }

        function onLogin(){
            $rootScope.$broadcast('authorized');
            $state.go('tab.nearBeacons');
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
  });



