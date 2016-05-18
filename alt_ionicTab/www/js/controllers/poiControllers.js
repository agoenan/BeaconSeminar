angular.module('BeaconApp.poiControllers', [])

    .controller('PoiCtrl', function (BeaconModel, $rootScope) {
        var poi = this;
        poi.objects = [];
        poi.getAll = getAll;    
        poi.isAuthorized = false;

      
        function getAll() {
            BeaconModel.all()
                .then(function (result) {
                    poi.data = result.data.data;
                });
        }

        function clearData(){
            poi.data = null;
        }          

        $rootScope.$on('authorized', function () {
            poi.isAuthorized = true;
            getAll();
        });

        $rootScope.$on('logout', function () {
            clearData();
        });

        if(!poi.isAuthorized){
            $rootScope.$broadcast('logout');
        }
        getAll();
    });