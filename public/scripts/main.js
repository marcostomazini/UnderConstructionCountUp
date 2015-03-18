require.config({
    baseUrl: 'scripts/lib',
    paths :{
        'app' : '../app/app',
        'controllers' : '../app/controllers',
        'angular' :'angular/angular.min',
        'angularRoute' : 'angular-route/angular-route.min',
        'angularLocalStorage' : 'angular-local-storage/dist/angular-local-storage.min',
        'jquery' : 'jquery/dist/jquery.min',
        'angularTimer': 'angular-timer/dist/angular-timer.min',
        'moment': 'momentjs/min/moment.min',
        'humanizeDuration': 'humanize-duration/humanize-duration'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angularRoute' :{
            deps: ['angular'],
            exports : 'angularRoute'
        },
        'angularLocalStorage' :{
            deps: ['angular'],
            exports : 'angularLocalStorage'
        },
        'angularTimer':{
            deps: ['angular'],
            exports : 'angularTimer'
        }
    }
});


require(['require','angular','angularRoute','angularLocalStorage','app','angularTimer','moment','humanizeDuration'], function () {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ['mainApp']);
    });
});