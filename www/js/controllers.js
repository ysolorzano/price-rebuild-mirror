angular.module('app.controllers', ['app.services','angular-stripe','ngLodash','truncate'])
  
.controller('feedCtrl', function($scope,$rootScope,$stateParams,$location,$state,$ionicModal,$q,$filter,Favorites,lodash,$ionicPlatform,PriceAPI,$ionicActionSheet) {
    $rootScope.products = [];
    
    $ionicPlatform.ready(function() {
        $state.go('price.splash');

    });

    $scope.refresh = function() {
        console.log('refresh products');
        PriceAPI.items.query({ //url params
            'price_min': $rootScope.price_min,
            'price_max': $rootScope.price_max
        },
        function(data) {
         $rootScope.products = lodash.map(data[0].products,function(product) {
            product.fields.isFavorite = Favorites.contains(product.fields);
            return product.fields;
            });
        
        $rootScope.currentSuggestions = $rootScope.products;

        console.log($rootScope.products);
         $scope.$broadcast('scroll.refreshComplete');
//          $scope.$apply()
    });
    }

    $scope.openProduct = function(product) {
        PriceAPI.suggestions.query({id: product.id}, function(data) {
            console.log('suggestions: ' + data);
            
            
//             $rootScope.currentSuggestions = $rootScope.products;
        });

        PriceAPI.item.get({id: product.id},function(data) {
            console.log(data);
            $rootScope.currentProduct = data;
            $scope.modal.show();
        });

        
    };
    
    $scope.refresh();

    $scope.openCategories = function() {
        
    };
    
    $scope.openFilters = function() {
        $ionicActionSheet.show({
        buttons: [
            {text: 'Above $300'},
            {text: '$100 - 300'},
            {text: 'Below $100'}
        ],
        buttonClicked: function(index) {
            console.log('clicked button');
            switch(index) {
                case 0: //above 300
                    console.log('should set max price');
                    $rootScope.min_price = '300';
                    $rootScope.max_price = '';
                    $scope.refresh();
                    return true;
                case 1 : // between 100-300
                    $rootScope.min_price = '100';
                    $rootScope.max_price = '300';
                    $scope.refresh();
                    return true;
                case 2 : // below 100
                    $rootScope.min_price = '';
                    $rootScope.max_price = '100';
                    $scope.refresh();
                    return true;
            }
        }

    })};
    
    $scope.favs = Favorites.get();
    
    $scope.favoriteStyle = function(item) {
        return Favorites.contains(item) ? "assertive" : "dark";
    };
    $scope.toggleFav = function(product) {
        if(Favorites.contains(product)) {
            Favorites.delete(product);
            product.isFavorite = false;
        } else {
            Favorites.add(product);
            product.isFavorite = true;
        }
        $scope.favs = Favorites.get();
    };

    $ionicModal.fromTemplateUrl('templates/productDetails.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up'
    }); 

})
   
.controller('favoritesCtrl', function($scope,Favorites) {
    console.log('loaded favs!');
    $scope.products = [];
    $scope.products = Favorites.get();
    console.log($scope.products);
})
   
.controller('accountCtrl', function($scope) {
    
})
    
.controller('itemViewCtrl',['$stateParams',function($scope,$stateParams,stripe) {
    $scope.card = {
        number: '4242424242424242',
        cvc: '123',
        exp_month: '12',
        exp_year: '19'
    };
    
    $scope.buyNow = function() {
        console.log('buying now!');
    }
    console.log('loaded item view controller');
    
}]);