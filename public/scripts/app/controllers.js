define(['angular'], function (angular) {
    'use strict';

    var mainAppControllers = angular.module('mainAppControllers', ['timer']);

    mainAppControllers.controller('HomeCtrl', ['$scope', '$http',
        function ($scope, $http) {

            $scope.startTime = 1426384502000; // miliseconds - http://www.timestampconvert.com/

            // $http({method: 'GET', url: '/api/things'}).
            //     success(function(data, status, headers, config) {
            //         $scope.things = data.things;
            //     }).
            //     error(function(data, status, headers, config) {

            //         if(status!==401){
            //             noty({text: data,  timeout: 2000, type: 'error'});
            //         }
            //     });

        }
    ]);

    return mainAppControllers;
});