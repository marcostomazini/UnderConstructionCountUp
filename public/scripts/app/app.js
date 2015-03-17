
define([
    'angular',
    'angularRoute',
    'angularLocalStorage',
    'controllers',
    'services'

], function (angular) {
    'use strict';

    var mainApp =  angular.module('mainApp', [
        'LocalStorageModule',
        'ngRoute',
        'myAppServices',
        'mainAppControllers'
    ]);


    mainApp.config(['$routeProvider',
        function($routeProvider) {

            $routeProvider.
                when('/home', {
                    templateUrl: 'partials/home',
                    controller: 'HomeCtrl'
                }).
                otherwise({
                    redirectTo: '/home'
                });
        }

    ]);


    mainApp.run(['$rootScope','$location','AuthenticationService',function($rootScope, $location, AuthenticationService) {
        $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {

            if (nextRoute.access===undefined) {
                $location.path("/home");
	    }
        });
    }]);

    return mainApp;


});




