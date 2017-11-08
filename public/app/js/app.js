'use strict';
var app = angular.module('angularSeed', ['ngRoute','ngMockE2E','ngMaterial','ngMessages']);
app.config(
        function Config($routeProvider, $httpProvider, $mdThemingProvider) {
        $routeProvider
            .when('/', {
                templateUrl : '/app/html/home.html',
                controller : 'indexCtrl',
                controllerUrl: 'controllers/indexCtrl.js'
            })
            .otherwise('/');
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
        $mdThemingProvider.definePalette('peachtree', {
            '50': '2ba0af',
            '100': '2ba0af',
            '200': '2ba0af',
            '300': '2ba0af',
            '400': '2ba0af',
            '500': '2ba0af',
            '600': '2ba0af',
            '700': '2ba0af',
            '800': '2ba0af',
            '900': '2ba0af',
            'A100': '2ba0af',
            'A200': '2ba0af',
            'A400': '2ba0af',
            'A700': '2ba0af',
            'contrastDefaultColor': 'light',    // whether, by default, text (contrast)
                                                // on this palette should be dark or light

            'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
            '200', '300', '400', 'A100'],
            'contrastLightColors': undefined    // could also specify this if default was 'dark'
        });
         
        $mdThemingProvider.theme('peachtree')
        .primaryPalette('peachtree',{
            'default':'700'
        })
        .accentPalette('peachtree');
});

/**
 * Mock backend intercepts every $http request
 */
app.run(function($httpBackend, transactionsDataService){
		console.log("fake backend is running");
        //pass through requests for html files
        $httpBackend.whenGET(/\.html$/).passThrough();

        //get mock transactions
        $httpBackend.whenGET('/transactions').respond(transactionsDataService.getTransactions());

        //save new transaction to mock transactions
        $httpBackend.whenPOST('/transactions').respond(function(method, url, data){
            var transactions = transactionsDataService.getTransactions();
            transactions.push(JSON.parse(data));
            localStorage.setItem("transactions", JSON.stringify(transactions));
            return [200, transactions, {}];
        })
});

app.run(function($rootScope){
	$rootScope.$on("$locationChangeStart", function(event, next, current){
		console.log("navigating to " + next);
	});
});