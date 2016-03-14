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
})
.directive('prFeedItem', function(){
  return {
    restrict: 'E', //<feed-item></feed-item>
    link: function($scope, element, attrs){
      console.log('feed-item...')
    },
    scope: {
      product: '=item'
    },
    templateUrl: 'templates/feed-item.html',
    controller: 'feedCtrl'
  }
})
.directive('prNumerator', function () {
    return {
        restrict: 'A', //E = element, A = attribute, C = class, M = comment
        link: function ($scope, element, attrs) {
          $scope.$watch('currentProduct.amount_saved', function(newVal, oldVal){
            if (newVal !== oldVal) {
                price = attrs.price
                options = {
      	          toValue: price,
                  fromValue: attrs.retail,
                  easing: 'linear',
                  duration: 2500,
                  delimiter: ',',
                  rounding: 2
                }
                $(element).numerator( options )
              }
          });

        } //DOM manipulation
    }
});
