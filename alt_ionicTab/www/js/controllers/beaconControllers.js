angular.module('BeaconApp.beaconControllers', [])

//BeaconController
.controller("BeaconCtrl", function($scope, $state, $rootScope, $ionicPlatform, $cordovaBeacon, $ionicPopup) {
      $scope.broadcast = function(id) {
         
           if(id == 12){
             $state.go('tab.information');
        }
         
     }
 
    $scope.beacons = {};

    $ionicPlatform.ready(function() {
        
        $cordovaBeacon.requestWhenInUseAuthorization();
 
        $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
            var uniqueBeaconKey;
            var rssiWidth = 1;
           
            
            for(var i = 0; i < pluginResult.beacons.length; i++) {
                
                if (pluginResult.beacons[i].rssi < -100) {
                    rssiWidth = 100; 
                }else if (pluginResult.beacons[i].rssi < 0) {
                    rssiWidth = 100 + pluginResult.beacons[i].rssi; 
                }
                
                uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":" + pluginResult.beacons[i].minor  ;
                pluginResult.beacons[i].rssiWidth = rssiWidth;
                $scope.beacons[uniqueBeaconKey] = pluginResult.beacons[i];
                
           
                
                if( pluginResult.beacons[i].major == 10 &&  pluginResult.beacons[i].minor == 11){
                    var region = "Chair of Software Engineering";
                    var name = "B6, 2C01";
                    
                    pluginResult.beacons[i].region = region;
                    pluginResult.beacons[i].name = name;
                    
                } else if(pluginResult.beacons[i].major == 10 &&  pluginResult.beacons[i].minor == 12){
                    var region = "Chair of Software Engineering";
                    var name = "Office of Prof. Atkinson";
               
                pluginResult.beacons[i].region = region;
                    pluginResult.beacons[i].name = name;
                    
                } else if(pluginResult.beacons[i].major == 11 &&  pluginResult.beacons[i].minor == 13){
                    var region = "Canteen";
                    var name = "Kubus";
            
                    pluginResult.beacons[i].region = region;
                    pluginResult.beacons[i].name = name;
                }
            }
            $scope.$apply();
        });
 
        $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("Softwareengineering", "2C96200F-07B9-422F-89B1-D7EC8EEB7CD7"));
        
});
    
     });

   


