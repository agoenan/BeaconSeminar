angular.module('BeaconApp.poiServices', [])

    .service('BeaconModel', function ($http, Backand) {
        var service = this,
            baseUrl = '/1/objects/',
            objectName = 'ibeacons/';

        function getUrl() {
            return Backand.getApiUrl() + baseUrl + objectName;
        }

        function getUrlForId(id) {
            return getUrl() + id;
        }

        service.all = function () {
            return $http.get(getUrl());
        };

 
    });
