angular.module('app.controllers', ['app.services','angular-stripe','ngLodash','truncate'])
  
.controller('feedCtrl', function($scope,$rootScope,$stateParams,$location,$state,$ionicModal,$q,$filter,Favorites,lodash,$ionicPlatform,PriceAPI,$ionicActionSheet,$anchorScroll,$ionicScrollDelegate) {
    $rootScope.products = [];
    
//     $state.go('signin');

    $rootScope.currentGender = 'female';
    
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
        scope: $scope,
        animation: 'slide-in-up'
    }); 
    
    $ionicModal.fromTemplateUrl('templates/categories.html', function($ionicModal) {
        $scope.catModal = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    }); 
    
    $scope.openCategories = function() {
        $scope.catModal.show();
        console.log($scope.categories);
    };
    $scope.selectedCategory = function(cat) {
        $scope.catModal.hide();
        $scope.currentCategory = cat;
    }
    
    $scope.$on('modal.shown', function(event) {
        $ionicScrollDelegate.$getByHandle('modalContent').scrollTop(true);
        $scope.activeSlide = 1;
        $ionicScrollDelegate.$getByHandle('suggestionScroller').scrollTo(0,0,false);
    });
    var catImg = [];
    for(i = 1; i < 6; i++) {
        catImg.push('img/cats/' + $rootScope.currentGender + '/img' + (i+1).toString() + '.svg');
    }
    
    $scope.categories = {
        female: [
            {
                name: 'sunglasses',
                img: catImg[0]
            },{
                name: 'watches',
                img: catImg[1]
            },{
                name: 'clothing',
                img: catImg[2]
            },{
                name: 'jewelry',
                img: catImg[3]
            },{
                name: 'bags',
                img: catImg[4]
            },{
                name: 'shoes',
                img: catImg[5]
            }],
        male: [
            {
                name: 'bags',
                img: catImg[0]
            },{
                name: 'clothing',
                img: catImg[1]
            },{
                name: 'watches',
                img: catImg[2]
            },{
                name: 'shoes',
                img: catImg[3]
            },{
                name: 'jewelry',
                img: catImg[4]
            },{
                name: 'sunglasses',
                img: catImg[5]
            }]
    };
    

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
    
}])
.controller('WelcomeCtrl',function($rootScope,$scope) {
    console.log('loaded welcome controller!'); 
    $scope.loginFacebook = function() {
        Ionic.Auth.login('facebook', {'remember': true}).then(function(user) {
            console.log('user logged in');
            console.log(user);
            }, function(e) {
                console.log('error logging in: ' + e);
            });
    } 
})
;