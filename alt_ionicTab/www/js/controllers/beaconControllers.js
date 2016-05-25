angular.module('BeaconApp.beaconControllers', [])

//BeaconController
.controller("BeaconCtrl", function($scope, $state, $rootScope, $ionicPlatform, $cordovaBeacon, $ionicPopup) {
     
 
    $scope.beacons = {};

    $ionicPlatform.ready(function() {
        
        $cordovaBeacon.requestWhenInUseAuthorization();
 
        $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
            var uniqueBeaconKey;
            var rssiWidth = 1;
            var distance = 1;
           
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
                    
                } else if( pluginResult.beacons[i].major == 100 && pluginResult.beacons[i].minor == 4){
                    var region = "Library A5";
                    var name = "Entrance";
                    pluginResult.beacons[i].region = region;
                    pluginResult.beacons[i].name = name;
                    distance = Math.pow(10, (pluginResult.beacons[i].txPower-pluginResult.beacons[i].rssi)/(10*2));
                    pluginResult.beacons[i].distance = distance;
                    
                } else if(pluginResult.beacons[i].major == 100 &&  pluginResult.beacons[i].minor == 3){
                    var region = "Library A5";
                    var name = "Bookshelf Informatics";
                    pluginResult.beacons[i].region = region;
                    pluginResult.beacons[i].name = name;
                    
                } else if(pluginResult.beacons[i].major == 100 &&  pluginResult.beacons[i].minor == 2){
                    var region = "Library A5";
                    var name = "Bookshelf Sociology";
                    pluginResult.beacons[i].region = region;
                    pluginResult.beacons[i].name = name;
                    
                }else if(pluginResult.beacons[i].major == 100 &&  pluginResult.beacons[i].minor == 1){
                    var region = "Library A5";
                    var name = "Library PCs";
                    pluginResult.beacons[i].region = region;
                    pluginResult.beacons[i].name = name;
                    
                }
            }
            
            
            $rootScope.beaconList = pluginResult.beacons;
            $scope.$apply();
        });
 
        $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("Softwareengineering", "2C96200F-07B9-422F-89B1-D7EC8EEB7CD7"));
        
});
    
     $rootScope.navigate = function(beacon) {
         if(beacon.minor == 4)
         {
             if(beacon.proximity == "ProximityNear"){
                 beacon.proximity = "Near";
             } else if(beacon.proximity == "ProximityFar"){
                 beacon.proximity = "Far";
             } else if(beacon.proximity == "ProximityImmediate"){
                 beacon.proximity = "Immediate";
             } else if(beacon.proximity == "ProximityUnknown"){
                 beacon.proximity = "Unknown";
             }
                 var strVar="";
                 strVar += "		<div class=\"my-content\">";
                 strVar += "			<h1>" + beacon.region + "<\/h1>";
                 strVar += "			<h2>Your Proximity to " + beacon.name + " is " + beacon.proximity + "<\/h2>";
                 strVar += "<div class=\"my-header\">";
                 strVar += "<img class=\"my-header-image\" src=\"img\/Library-Entrance.png\" \/>";
                 strVar += "<img class=\"my-icon-back\" src=\"img\/icon-back.png\" ontouchend=\"history.back()\" \/>";
                 strVar += "<\/div>";
                 $('#navigationInfo').html(strVar);
                 $state.go('tab.navigation');       
         }
        else  if(beacon.minor == 3)
         {
                 if(beacon.proximity == "ProximityNear"){
                 beacon.proximity = "Near";
             } else if(beacon.proximity == "ProximityFar"){
                 beacon.proximity = "Far";
             } else if(beacon.proximity == "ProximityImmediate"){
                 beacon.proximity = "Immediate";
             } else if(beacon.proximity == "ProximityUnknown"){
                 beacon.proximity = "Unknown";
             }
                 var strVar="";
                 strVar += "		<div class=\"my-content\">";
                 strVar += "			<h1>" + beacon.region + "<\/h1>";
                 strVar += "			<h2>Your Proximity to " + beacon.name + " is " + beacon.proximity + "<\/h2>";
                 strVar += "<div class=\"my-header\">";
                 strVar += "<img class=\"my-header-image\" src=\"img\/Library-Informatics.png\" \/>";
                 strVar += "<img class=\"my-icon-back\" src=\"img\/icon-back.png\" ontouchend=\"history.back()\" \/>";
                 strVar += "<\/div>";
                 $('#navigationInfo').html(strVar);
                 $state.go('tab.navigation');      
         }
         else if(beacon.minor == 2)
         {
                 if(beacon.proximity == "ProximityNear"){
                 beacon.proximity = "Near";
             } else if(beacon.proximity == "ProximityFar"){
                 beacon.proximity = "Far";
             } else if(beacon.proximity == "ProximityImmediate"){
                 beacon.proximity = "Immediate";
             } else if(beacon.proximity == "ProximityUnknown"){
                 beacon.proximity = "Unknown";
             }
                 var strVar="";
                 strVar += "		<div class=\"my-content\">";
                 strVar += "			<h1>" + beacon.region + "<\/h1>";
                 strVar += "			<h2>Your Proximity to " + beacon.name + " is " + beacon.proximity + "<\/h2>";
                 strVar += "<div class=\"my-header\">";
                 strVar += "<img class=\"my-header-image\" src=\"img\/Library-Sociology.png\" \/>";
                 strVar += "<img class=\"my-icon-back\" src=\"img\/icon-back.png\" ontouchend=\"history.back()\" \/>";
                 strVar += "<\/div>";
                 $('#navigationInfo').html(strVar);
                 $state.go('tab.navigation');       
         }
         else if(beacon.minor == 1)
         {
                 if(beacon.proximity == "ProximityNear"){
                 beacon.proximity = "Near";
             } else if(beacon.proximity == "ProximityFar"){
                 beacon.proximity = "Far";
             } else if(beacon.proximity == "ProximityImmediate"){
                 beacon.proximity = "Immediate";
             } else if(beacon.proximity == "ProximityUnknown"){
                 beacon.proximity = "Unknown";
             }
                 var strVar="";
                 strVar += "		<div class=\"my-content\">";
                 strVar += "			<h1>" + beacon.region + "<\/h1>";
                 strVar += "			<h2>Your Proximity to " + beacon.name + " is " + beacon.proximity + "<\/h2>";
                 strVar += "<div class=\"my-header\">";
                 strVar += "<img class=\"my-header-image\" src=\"img\/Library-PCs.png\" \/>";
                 strVar += "<img class=\"my-icon-back\" src=\"img\/icon-back.png\" ontouchend=\"history.back()\" \/>";
                 strVar += "<\/div>";
                 $('#navigationInfo').html(strVar);
                 $state.go('tab.navigation');       
         }
     }
   
    
     $rootScope.broadcast = function(beacon) {
         
      
         
           if(beacon.minor == 11 && (beacon.proximity == 'ProximityImmediate' || beacon.proximity == 'ProximityNear')){          
               
var strVar="";
strVar += " <div class=\"my-header\">";
strVar += "			<img class=\"my-header-image\" src=\"img\/eam.jpg\" \/>";
strVar += "			<img class=\"my-icon-back\" src=\"img\/icon-back.png\" ontouchend=\"history.back()\" \/>";
strVar += "		<\/div>";
strVar += "        ";
strVar += "		<div class=\"my-content\">";
strVar += "			<h1>Software Engineering<\/h1>";
strVar += "			<p>Seminar Schedule<\/p>";
strVar += "			<p>19. Mai 2016 <\/p>";
strVar += " ";
strVar += "        <ul class=\"list\">          ";
strVar += "            <li class=\"item\">";
strVar += "               09:30 Dang, Thu Huong";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "              09:45 Duendar, Tugba";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               10:00 Goenan, Ahmet";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "              10:15 Guel, Rusen";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "              11:15 Hernandez Torres, Valeria";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               11:30 Hu, Rui";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "              11:45 Kharushka, Aliaksandra ";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               14:15 Mattr, Mohammed";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               14:30 Mohammed, Jahangir Ali";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               14:45 Nofal, Diaa";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               15:00 Sankaran, Vignesh";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               15:45 Schadrin, Elina";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "               16:00 Gamze Özdemir";
strVar += "            <\/li>";
strVar += "             <li class=\"item\">";
strVar += "              16:15 Schoenfelder, David Timothee";
strVar += "            <\/li>";
strVar += "<\/ul>";

//$('#beacon').append("");
               
               
               
                $("#legend").html(strVar); 
                $state.go('tab.information');
        }
         
         
         else if(beacon.minor == 13){
        strVar += " <div class=\"my-header\">";
        strVar += "			<img class=\"my-header-image\" src=\"img\/breakfast.jpg\" \/>";
        strVar += "			<img class=\"my-icon-back\" src=\"img\/icon-back.png\" ontouchend=\"history.back()\" \/>";
        strVar += "		<\/div>";
        strVar += "        ";
             strVar += "		<div class=\"my-content\">";
               $("#legend").html(strVar); 
               $state.go('tab.information')
             
    }
     }
         
    
  
    
     });

   


