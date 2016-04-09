
angular.module('BeaconApp.userManagementServices', [])

  .service('LoginService', function (Backand) {
        var service = this;

        service.signin = function (email, password, appName) {
            //call Backand for sign in
            return Backand.signin(email, password);
        };

        service.anonymousLogin= function(){
            // don't have to do anything here,
            // because we set app token att app.js
        }

        service.signout = function () {
            return Backand.signout();
        };
    })


  // .service('RegisterService', function ($http, Backand) {
    //    var service = this;

    //    service.createAccount = function (firstname, lastname, email, password, appName) {
            //call Backand for create Account
    //        return Backand.createAccount(firstname, lastname, email, password);
    //    };
    
    
    
    //})

;