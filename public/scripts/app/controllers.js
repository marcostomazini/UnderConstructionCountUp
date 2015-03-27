define(['angular'], function (angular) {
    'use strict';

    var mainAppControllers = angular.module('mainAppControllers', ['timer']);

    mainAppControllers.controller('HomeCtrl', ['$scope', '$http', '$interval',
        function ($scope, $http,$interval) {

            $scope.url = "http://svrhomtreetech:8080";
			
            $interval( function(){                 
                $scope.callTeamCity();
            }, 60000);

            var now = Date.now();
            $scope.startTime = now; // miliseconds - http://www.timestampconvert.com/

            $scope.getLastFailure = function (buidList) {

                return _.find(buidList,function(build){ return build.status == "FAILURE"});                
            };

            $scope.getLastBuild = function (buidList) {

                return buidList[0];
            };
            
            $scope.getBuildFailure =  function(buildFailure){

                var time = Date.now();

                $http({
                    method: 'GET', 
                    url: $scope.url + buildFailure.href
                }).success(function(data, status, headers, config) {
                    $scope.startTime = $scope.formatMillisecondsToDateTime(data.startDate);
                }).error(function(data, status, headers, config) {
                    return null;
                });

                return time;
            }

            $scope.formatMillisecondsToDateTime = function(time){

                var momentDate = moment(time, "YYYYMMDD hh:mm:ss")

                var date = new Date (momentDate);

                return date.getTime();
            }

            $scope.showFailureError = function(){

            }

            $scope.teste = function(){
                return "teste";
            }

            $scope.verifyBuild = function(buildList){

                var buildFailure = $scope.getLastFailure(buidList);                

                if(buildFailure){

                    var lastBuild = $scope.getLastBuild(build);

                    if(buildFailure.Id == lastBuild.Id){
                        $scope.showFailureError();
                    }
                    else
                    {
                        $scope.getBuildFailure(buildFailure);
                    }                    
                }                
            }

            $scope.callTeamCity = function() {
                $http({
                    method: 'GET', 
                    url: $scope.url + '/guestAuth/app/rest/buildTypes/id:Develop_TreetechSamDevDB1/builds/?count=500&start=0'
                }).success(function(data, status, headers, config) {
                    $scope.getLastFailure(data.build);
                }).error(function(data, status, headers, config) {
                    console.log('error');
                });
            };
			$scope.callTeamCity();
        }
    ]);

    return mainAppControllers;
});