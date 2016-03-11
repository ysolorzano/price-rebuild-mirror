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
.directive('prNumerator', function () {
    return {
        restrict: 'A', //E = element, A = attribute, C = class, M = comment

        link: function ($scope, element, attrs) {
          console.log('numerating....')
          console.log(attrs)
          // $scope.$watch('currentProduct.amount_saved', function(newVal, oldVal){
          //     if (newVal !== oldVal) {
          //         // Do stuff ...
          //         console.log('numerating....')
          //         console.log(attrs)
          //     }
          // });
          // price = attrs
          // options = {
	        //   toValue: price,
          //   easing: 'linear',
          //   duration: 2000,
          //   delimiter: ',',
          //   rounding: 2
          // }}
          // $(element).numerator( options )
        } //DOM manipulation
    }
});
