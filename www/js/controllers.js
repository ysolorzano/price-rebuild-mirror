angular.module('app.controllers', ['app.services','angular-stripe','ngLodash','truncate'])
  
.controller('feedCtrl', function($scope,$rootScope,$stateParams,$location,$state,$ionicModal,$q,$filter,Favorites,lodash,$ionicPlatform,PriceAPI,$ionicActionSheet,$anchorScroll,$ionicScrollDelegate,$http,localStorageService) {
    $rootScope.products = [];
    
    $rootScope.currentGender = 'female';
    $rootScope.page_no = 1;
    $scope.refresh = function() {
        console.log('refresh products');
        $http( {
            method: 'GET',
            url: $rootScope.hostUrl + '/item/list/',
            params: {
                'price_min' : $rootScope.min_price,
                'price_max' : $rootScope.max_price,
                'category' : $rootScope.currentCategory, //$rootScope.category
                'page': $rootScope.page_no,
                'show_by': 10,
                'type' : $rootScope.currentGender //$rootScope.gender


            }
        }).then( function(data) {
            console.log(data);
            $rootScope.products = lodash.map(data.data[0].products,function(product) {
            product.fields.isFavorite = Favorites.contains(product.fields);
            return product.fields;
            });

            console.log($rootScope.products);
            $scope.$broadcast('scroll.refreshComplete');

            },
            function(e) {
                console.log(e)
            });
       
    }

    $scope.openProduct = function(product) {
        var productId = product.id ? product.id : product.pk;
        console.log('opening product with id: ' + productId);
        $http.get($rootScope.hostUrl + '/item/similar-category/' + productId + '/').then(function(data) {
            $rootScope.currentSuggestions = data.data;
            console.log(data.data);
        },function(e) {
            console.log(e);
        });
        
/*
        PriceAPI.suggestions.get({id: product.id}, function(data) {
            console.log('suggestions...');
            console.log(data);            
        });
*/
        PriceAPI.item.get({id: productId},function(data) {
            console.log(data);
            $rootScope.currentProduct = data;
            resetProductModal();
            $scope.modal.show(); 
        });

        
    };
    
    var user = Ionic.User.current();

    if (user.isAuthenticated()) {
        console.log('user logged in!');
    } else if(ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
        $state.go('signin');
    }
    
    
    $scope.$on('$ionicView.beforeEnter', function(){
        $scope.refresh();
    });

    
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
        console.log('should open categories');
        $scope.catModal.show();
        console.log($scope.categories);
    };
    $scope.selectedCategory = function(cat) {
        $scope.catModal.hide();
        $scope.currentCategory = cat;
    }
    
    $scope.$on('modal.shown', function(event) {
//         resetProductModal();
    });
    
    function resetProductModal() {
        $ionicScrollDelegate.$getByHandle('modalContent').scrollTop(true);
        $scope.activeSlide = 1;
        $ionicScrollDelegate.$getByHandle('suggestionScroller').scrollTo(0,0,false);
    }
    
    $scope.categories = PriceAPI.categories;
    

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
.controller('WelcomeCtrl',function($rootScope,$scope,$state,localStorageService) {
    console.log('loaded welcome controller!'); 
    $scope.loginFacebook = function() {
        Ionic.Auth.login('facebook', {'remember': true}).then(function(user) {
            console.log('user logged in');
            console.log(user);
            Ionic.User.current().save();
//             localStorageService.set('userId',user.)
            
            console.log(Ionic.User.current());
            
            $state.go('tabs.feed');
            }, function(e) {
                console.log('error logging in: ' + e);
            });
    } 
})
;