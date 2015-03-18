define(['angular'], function (angular) {
    'use strict';

    var mainAppControllers = angular.module('mainAppControllers', ['timer']);

    mainAppControllers.controller('HomeCtrl', ['$scope', '$http', '$interval',
        function ($scope, $http,$interval) {

            $interval( function(){                 
                $scope.callTeamCity()              
            }, 60000);

            var now = Date.now();
            $scope.startTime = now; // miliseconds - http://www.timestampconvert.com/

            $scope.callTeamCity = function() {
                $scope.startTime = Date.now(); 

                // 20150314T203837+0000 DATA QUE VEM DO TEAMCITY CONVERTER PARA MILISEGUNDOS
                // moment('2015-03-14 20:38:37')

                // $http({method: 'GET', url: 'http://ci.signalr.net/guestAuth/app/rest/buildTypes/id:bt116/builds/running:false,status:success'}).
                //     success(function(data, status, headers, config) {
                //         console.log('sucess');
                //     }).
                //     error(function(data, status, headers, config) {
                //        console.log('error');
                //     });
            };
        }
    ]);

    return mainAppControllers;
});