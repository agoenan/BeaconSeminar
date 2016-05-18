angular.module('BeaconApp.beaconControllers', [])

//BeaconController
.controller("BeaconCtrl", function($scope, $state, $rootScope, $ionicPlatform, $cordovaBeacon, $ionicPopup) {
     
 
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
    
    
    
    
    
     $scope.broadcast = function(beacon) {
         
      
         
           if(beacon.minor == 11 && (beacon.proximity == 'ProximityImmediate' || beacon.proximity == 'ProximityNear')){          
               
var strVar="";
strVar += " <div class=\"my-header\">";
strVar += "			<img class=\"my-header-image\" src=\"img\/eam.jpg\" \/>";
strVar += "			<img class=\"my-icon-back\" src=\"img\/icon-back.png\" ontouchend=\"history.back()\" \/>";
strVar += "		<\/div>";
strVar += "        ";
strVar += "		<div class=\"my-content\">";
strVar += "			<h1>Seminar Schedule<\/h1>";
strVar += "			<p>Prof. Dr. Colin Atkinson<\/p>";
strVar += " ";
strVar += "        <ul class=\"list\">          ";
strVar += "            <li class=\"item\">";
strVar += "               09:45 ahha";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               09:45 ahha";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               09:45 ahha";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               09:45 ahha";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               09:45 ahha";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               09:45 ahha";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               09:45 ahha";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               09:45 ahha";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               09:45 ahha";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               09:45 ahha";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               09:45 ahha";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               09:45 ahha";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               09:45 ahha";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               09:45 ahha";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               09:45 ahha";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               09:45 ahha";
strVar += "            <\/li>";
strVar += "<\/ul>";

$('#beacon').append("");
               
               var element = $(strVar);
		$('#beacon').append(element);
               
               
               
               
               
                    $state.go('tab.information');
            }
         
     }
    
     });

   


