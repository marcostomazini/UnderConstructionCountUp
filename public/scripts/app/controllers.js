define(['angular'], function (angular) {
    'use strict';

    var mainAppControllers = angular.module('mainAppControllers', []);

    mainAppControllers.controller('HomeCtrl', ['$scope', '$http',
        function ($scope, $http) {

            $http({method: 'GET', url: '/api/things'}).
                success(function(data, status, headers, config) {
                    $scope.things = data.things;
                }).
                error(function(data, status, headers, config) {

                    if(status!==401){
                        noty({text: data,  timeout: 2000, type: 'error'});
                    }
                });

        }
    ]);


    return mainAppControllers;

});





