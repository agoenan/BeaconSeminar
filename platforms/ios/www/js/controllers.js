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

.controller('BeaconCtrl', function () {
    
    // Strings, in denen die Device-Platform und die Device-ID 
	// gespeichert werden
	var devicePlatform = "",
		deviceID = "",
	
	// Das Applikationsobjekt
		app = {},

	// Array, welches die Events aufzeichnet
		eventsMonitored = [],

	// Boolean für den am nächsten liegenden iBeacon
		closest_iBeacon = null,

	// Boolean timer für iBeacons
		closest_iBeacon_timer = null,

	// Boolean, welcher angibt, ob sich die Applikation 
	// im "Background"-Modus befindet
		is_our_app_in_background = false,

	// Ein Counter, welcher angibt, wie viele Background-
	// Notifications es schon gegeben hat
		notificationID = 0,

	// Ein Mapping, welches verwendet wird, um die Region 
	// Events zu übersetzen. Diese werden im Event-
	// Display-String verwendet
		regionNames =
	{
		'CLRegionStateInside': 'Gehe in Region',
		'CLRegionStateOutside': 'Verlasse Region'
	},

	// Hier werden die verschiedenen Regionen definiert.
	// Momentan sind zwei iBeacons im Einsatz also sind "nur" 
	// zwei Regionen definiert
		defined_Regions =
	[
		{
			id: 'region1',
			uuid: 'f0018b9b-7509-4c31-a905-1a27d39c003c',
			major: 16179,
			minor: 58447
		},
		{
			id: 'region2',
			uuid: 'f0018b9b-7509-4c31-a905-1a27d39c003c',
			major: 58359,
			minor: 12630
		}
	],

	// Die oben genannten ID's werden nun in besser verständliche 
	// Namen von Regionen übersetzt. In unserem imaginären Supermarkt 
	// gibt es zwei Regionen 1. Getränke und 2. Fleisch
		regionData =
	{
		'region1': 'Getränke',
		'region2': 'Fleisch'
	};

	// Diese Funktion wird aufgerufen, wenn die Applikation initial startet.
	app.init = function(){
		
		// Dieses Event ist essentiell für jede Applikation.
		// Das "deviceready"-Event wird ausgeführt, wenn die 
		// Cordova device API geladen ist und verwendet werden kann.
		// http://cordova.apache.org/docs/en/5.0.0/cordova_events_
		// events.md.html#deviceready
		document.addEventListener('deviceready', onCordovaReady, false);
		
		// Das "pause"-Event wird ausgeführt, wenn die native Platform 
		// (also iOS, Windowsphone, Android etc.) die Applikation in 
		// den Hintergrund verschiebt. Dies passiert z.B. wenn der Nutzer 
		// in eine andere Applikation auf dem Smartphone wechselt
		// http://cordova.apache.org/docs/en/5.0.0/cordova_events_
		// events.md.html#pause
		document.addEventListener('pause', onAppToBackground, false);
		
		// Das "resume"-Event wird ausgeführt, wenn die native Platform 
		// die Applikation wieder in den Vordergrund holt
		// http://cordova.apache.org/docs/en/5.0.0/cordova_events_
		// events.md.html#resume
		document.addEventListener('resume', onAppToForeground, false);
		
	};
	
	
	// Diese Funktion wird aufgerufen, wenn das Event deviceready "gefeuert" 
	// hat und enthält weitere Funktionen, welche ausgeführt werden
	function onCordovaReady(){
		
		devicePlatform = device.platform;
		deviceID = device.uuid;
		
		// Prüfung, ob das Bluetooth auf dem Smartphone eingeschaltet ist.
		// Wenn nicht, wird das Bluetooth eingeschaltet
		cordova.plugins.locationManager.isBluetoothEnabled()
	    .then(function(booleanEnabledfromNativeLayer){
	        
	        if (booleanEnabledfromNativeLayer) {
	        	return;
	        	//console.log("Bluetooth ist akiviert" 
	        	//		+ booleanEnabledfromNativeLayer);
	        } else {
	        	//console.log("Bluetooth ist deaktiviert");
	            cordova.plugins.locationManager.enableBluetooth(); 
	            alert('Das Bluetooth an Ihrem Gerät wurde aktiviert.');
	            //console.log("Bluetooth wurde aktiviert");
	        }
	    })
	    .fail(console.error)
	    .done();
		
		startingMonitoringPlusRanging();
		setNearestBeaconFrontendDisplayTimer();
		displayRegionEvents();	
		
	}
	
	// All the function that will be called, if the application is in 
	// background. Diese Funktion enthält jegliche Funktionen, die 
	// aufgerufen werden, wenn die Applikation im Hintergrund läuft 
	// (das Smartphone z.B. gesperrt wird)
	function onAppToBackground(){
		
		is_our_app_in_background = true;
		stopTimerToshowTheNearestBeaconInFrontend();
		
	}
	
	// Diese Funktionen werden aufgerufen, wenn das Event resume 
	// getriggert wird
	function onAppToForeground(){
		
		is_our_app_in_background = false;
		setNearestBeaconFrontendDisplayTimer();
		displayRegionEvents();
		
	}

	function setNearestBeaconFrontendDisplayTimer(){
		
		// Jede Sekunde wird die Funktion showTheNearestBeaconInFrontend 
		// aufgerufen. Diese Updated das Frontend
		closest_iBeacon_timer = setInterval(showTheNearestBeaconInFrontend, 1000);
		
	}

	function stopTimerToshowTheNearestBeaconInFrontend(){
		
		clearInterval(closest_iBeacon_timer);
		closest_iBeacon_timer = null;
		
	}
	
	// Diese Funktion startet das Monitoring und das Ranging siehe 
	// Kapitel 2.2.4 und 2.2.5 in der Ausarbeitung
	function startingMonitoringPlusRanging(){
		
		function onDidDetermineStateForRegion(result){
			
			saveRegionEvent(result.state, result.region.identifier);
			displayRecentRegionEvent();
			
		}

		function onDidRangeBeaconsInRegion(result){
			
			updateNearestBeacon(result.beacons);
			
		}

		function onError(errorMessage){
			
			console.log('Es ist ein Fehler aufgetreten. startingMonitoringPlusRangingRegions : ' + errorMessage);
			
		}

		// Hier wird ein Delegate-Objekt erstellt, welches die 
		// Callback-Funktionen für die Beacons enthält
		var delegate = new cordova.plugins.locationManager.Delegate();
		cordova.plugins.locationManager.setDelegate(delegate);

		// Hier werden die Delegate-Callback-Funktionen gesetzt
		delegate.didDetermineStateForRegion = onDidDetermineStateForRegion;
		delegate.didRangeBeaconsInRegion = onDidRangeBeaconsInRegion;

		// Mit dieser Funktion un den dazugehörigen Parametern wird 
		// das Monitoring und das Ranging gestartet
		startingMonitoringPlusRangingRegions(defined_Regions, onError);
	}

	function startingMonitoringPlusRangingRegions(regions, errorCallback){
		
		// Hier wird das Monitoring bzw. Ranging gestartet
		for (var i in regions){
			
			startingMonitoringPlusRangingRegion(regions[i], errorCallback);
			
		}
		
	}

	function startingMonitoringPlusRangingRegion(region, errorCallback){
		
		// Hier wird eine sogenannte Beacon-Region erstellt
		// die Plugin-Funktion benötigt hierzu die ID, die UUID, die 
		// Major- sowie die Minor-Nummer des iBeacon
		var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(
			region.id,
			region.uuid,
			region.major,
			region.minor);

		// Hier wird das ranging also die Entfernungsmessung vom 
		// Smartphone zum iBeacon gestartet Grundlage hierfür ist die 
		// stärke des Signals des iBeacons, welches das Smartphone empfängt
		// Warnung: Die Entfernung zu messen ist eine relativ energiebedürftige 
		// Operation. Das Smartphone muss hierbei alle Signale der iBeacons 
		// verarbeiten, was das permanente Arbeiten des Bluetooth-Moduls am 
		// Smartphone voraussetzt
		cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
			.fail(errorCallback)
			.done();

		// Hier wird das sogenannte Monitoring gestartet
		cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
			.fail(errorCallback)
			.done();
		
	}

	function saveRegionEvent(eventType, regionId){
		
		// Speichert das Event in ein Array
		eventsMonitored.push(
		{
			type: eventType,
			date: getDateNow(),
			time: getTimeNow(),
			regionId: regionId
		});

		// Array ist auf 5 Einträge begrenzt
		if (eventsMonitored.length > 5){
			
			eventsMonitored.shift();
			
		}
		
	}
	
	// Erstellung einer "beaconID" welche sich aus uuid, major und 
	// minor-Nummern zusammensetzt
	function getBeaconId(beacon){
		
		return beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
		
	}
	
	// Vergleich, ob zwei Beacons die selben sind
	function isSameBeacon(beacon1, beacon2){
		
		return getBeaconId(beacon1) == getBeaconId(beacon2);
		
	}

	// vergleich von zwei Beacons und evaluierung welcher näher ist
	function isNearerThan(beacon1, beacon2){
		
		return beacon1.accuracy > 0
			&& beacon2.accuracy > 0
			&& beacon1.accuracy < beacon2.accuracy;
			
	}
	
	// Update des näheren Beacons
	function updateNearestBeacon(beacons){
		
		for (var i = 0; i < beacons.length; ++i)
		{
			var beacon = beacons[i];
			if (!closest_iBeacon)
			{
				closest_iBeacon = beacon;
			}
			else
			{
				if (isSameBeacon(beacon, closest_iBeacon) ||
					isNearerThan(beacon, closest_iBeacon))
				{
					closest_iBeacon = beacon;
				}
			}
		}
		
	}
	
	// Diese Funktion ist für die anzeige im Frontend und für 
	// die Verbindung mit dem Raspberry-Pi also dem Applikationsserver 
	// über Socket.IO zuständig
	function showTheNearestBeaconInFrontend(){
		
		if (!closest_iBeacon) { return undefined; }
		
		// Hier wird die Verbindung der Applikation (auf dem Smartphone) 
		// zu dem Applikationsserver über Socket.IO hergesellt. Dies 
		// geschieht innerhalb eines Lokalen Netzwerkes es werden außerdem 
		// Daten an den Server übertragen
		var socket = io.connect("http://192.168.2.101:8002");
	    socket.emit('client_data', {'iBeaconSignal': closest_iBeacon, 
	    							'event': regionData[eventsMonitored[eventsMonitored.length - 1].regionId],
	    							'devicePlatform': devicePlatform, 
	    							'deviceID': deviceID,
	    							'date': getDateNow(),
	    							'timestamp': getTimeNow()});
	    
		
		// Bereinigen von #beacon
		$('#beacon').empty();
		
		
		var rssiWidth = 1; 
		if (closest_iBeacon.rssi < -100) { rssiWidth = 100; }
		else if (closest_iBeacon.rssi < 0) { rssiWidth = 100 + closest_iBeacon.rssi; }
		
		// HTML und inhalte für die Darstellung im Frontend
		var element = $(
			'<li>'
			+	'<strong>Der am nächsten liegende iBeacon</strong><br />'
			+	'UUID: ' + closest_iBeacon.uuid + '<br />'
			+	'Major: ' + closest_iBeacon.major + '<br />'		
			+	'Minor: ' + closest_iBeacon.minor + '<br />'
			+	'Proximity: ' + closest_iBeacon.proximity + '<br />'
			+	'Distance: ' + closest_iBeacon.accuracy + ' Meter<br />'
			+	'RSSI: ' + closest_iBeacon.rssi + '<br />'
			+ 	'<div style="background:rgb(65,105,225);height:20px;width:'
			+ 		rssiWidth + '%;"></div>'
			+ '</li>'
			);
		$('#beacon').append(element);
		
	}
	
	function displayRecentRegionEvent(){	
		
		// Befindet sich die Applikation im Hintergrund, so wird nur eine
		// Notifikation für den Smartphone-Nutzer angezeigt
		if (is_our_app_in_background){
			
			// Titel der Notifikation
			var event = eventsMonitored[eventsMonitored.length - 1];
			if (!event) { return; }
			var title = getEventDisplayString(event);

			// Die Notifikation
			cordova.plugins.notification.local.schedule({
    			id: ++notificationID,
    			title: title });
			
		}
		
		// Wenn sich die Applikation im Vordergrund befindet, so wird 
		// das Event angezeigt
		else{
			
			displayRegionEvents();
			
		}
		
	}
	
	// Zeigt ein neues Event in der geöffneten Applikation an
	function displayRegionEvents(){
		
		// Bereinigen der Liste
		$('#events').empty();

		// Updaten der Liste
		for (var i = eventsMonitored.length - 1; i >= 0; --i)
		{
			var event = eventsMonitored[i];
			var title = getEventDisplayString(event);
			var element = $(
				'<li>'
				+ '<strong>' + title + '</strong>'
				+ '</li>'
				);
			$('#events').append(element);
		}
		
		// Wenn die liste leer ist, wird ein Hinweis für den Nutzer angezeigt, 
		// dass der sich erst einmal in eine Region und somit in den 
		// Sendebereich eines iBeacons begeben muss
		if (eventsMonitored.length <= 0){
			
			var element = $(
				'<li>'
				+ '<strong>'
				+	'Die Applikation wartet darauf, dass Sie in die nähe eines iBeacons kommen.'
				+ '</strong>'
				+ '</li>'
				);
			$('#events').append(element);
		}
		
	}

	function getEventDisplayString(event){
		
		return event.date + ' ' + event.time + ': '
			+ regionNames[event.type] + ' '
			+ regionData[event.regionId];
		
	}
	
	// Datum-erstellungs-Funktion
	function getDateNow(){
		
		var date = new Date();
		
		var yyyy = date.getFullYear().toString();
		var mm = (date.getMonth()+1).toString();
		var dd  = date.getDate().toString();
		 
		
		var mmChars = mm.split('');
		var ddChars = dd.split('');
		 
		
		return yyyy + '-' + (mmChars[1]?mm:"0"+mmChars[0]) + '-' + (ddChars[1]?dd:"0"+ddChars[0]);
		
	}
	
	// Zeit-erstellungs-Funktion
	function getTimeNow(){
		
		function pad(n)
		{
			return (n < 10) ? '0' + n : n;
		}

		function format(h, m, s)
		{
			return pad(h) + ':' + pad(m)  + ':' + pad(s);
		}

		var d = new Date();
		return format(d.getHours(), d.getMinutes(), d.getSeconds());
		
	}

	return app;
    
    
    
    
    
    
    
    
    
    
    
      
    })



























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



