angular.module('app.directives', ['app.controllers'])

.directive('prProductView', function (productViewCtrl) {
    return {
        restrict: 'E', //E = element, A = attribute, C = class, M = comment         
        scope: {
            //@ reads the attribute value, = provides two-way binding, & works with functions
            title: '@'         },
        templateUrl: 'productFeed.html',
        controller: productViewCtrl, //Embed a custom controller in the directive
        link: function ($scope, element, attrs) {
            
        } //DOM manipulation
    }
});

