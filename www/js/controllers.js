
angular.module('app.controllers', ['app.services','ngLodash','truncate','ngIOS9UIWebViewPatch','ngCordova','app.directives'])  
.controller('feedCtrl', function($scope,$rootScope,$stateParams,$location,$state,$ionicModal,$q,$filter,lodash,$ionicPlatform,PriceAPI,$ionicActionSheet,$anchorScroll,$ionicScrollDelegate,$http,localStorageService,$timeout,$ionicLoading,Favs) {
    
    $scope.$on('$ionicView.beforeEnter',function() {
        $ionicLoading.show();        
    })
    
    $scope.$on('$ionicView.afterEnter', function(){
        //for some reason...
        //Favs.getList() doesn't work here...
         $http.get('http://staging12.getpriceapp.com' + '/favourites/list?user=76').then(function(res) {
          console.log('got favs...');
          console.log(res);
          $rootScope.favs = res.data;
          // the feed is loaded after the favs
          // because each item in the feed
          // is compared to the favs
          // to add the isFavorite property
          // someday we'll do it a better way...
          $scope.refresh();
      },function(err) {
          console.log(err);
      });

    });
    
    $ionicPlatform.ready(function(){
        


  });
  $scope.testArray = ["poop",
  "crap","feces"];

  $scope.canReload = true;
    $rootScope.products = [];
    $rootScope.currentGender = 'female';
    $scope.refresh = function()  {
        
        $rootScope.pageNum = 0;
        $scope.loadNextPage();
        $scope.canReload = false;
        $timeout(function() {
            $scope.canReload = true;
        },1000);
    };
    $scope.loadNextPage = function() {
        console.log('should load next page');
        $rootScope.pageNum++;
        PriceAPI.items($rootScope.pageNum).then(function(res) {
            console.log(res);
            if($rootScope.pageNum == 1)
                $rootScope.products = [];
            $rootScope.products = lodash.concat($rootScope.products,res);
        $scope.$broadcast('scroll.refreshComplete');
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $ionicLoading.hide();
        })

    }


    $scope.openProduct = function(product) {
        $ionicLoading.show();
        var productId = product.item_id ? product.item_id : product.pk;

        console.log('opening product with id: ' + productId);

        $http.get($rootScope.hostUrl + '/item-details/' + productId+'/').then(function(res) {
            console.log('should get item data...');
            console.log(res);
            // $rootScope.currentProduct = res.data;
            $scope.currentProduct = res.data;
            resetProductModal();
            $scope.modal.show();

        })


        PriceAPI.item.get({id: productId},function(data) {

        });
        
        $http.get($rootScope.hostUrl + '/item/similar-category/' + productId + '/').then(function(data) {
            // $rootScope.currentSuggestions = data.data;
            $scope.currentSuggestions = data.data;
            console.log(data.data);
            $ionicLoading.hide();
        },function(e) {
            console.log(e);
        });


/*
        PriceAPI.suggestions.get({id: product.id}, function(data) {
            console.log('suggestions...');
            console.log(data);
        });
*/


    };

    if(localStorageService.get('accessToken')) {
        //user already logged in
    } else if(ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
        $rootScope.user.fullName = "RJ Jain";
        $rootScope.user.photoUrl = 'https://scontent.fsnc1-1.fna.fbcdn.net/hphotos-xla1/t31.0-8/12747354_10154146476332018_18157417964440176_o.jpg';
        
//         $state.go('signin');
    }


    $scope.openPriceFilters = function() {
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
    $scope.userMinPrice = 5;
    $scope.userMinPrice = 1000;
    
    $scope.minPrice = 5;
    $scope.maxPrice = 1000;

    $scope.applyFilters = function() {
        $rootScope.min_price = $scope.userMinPrice;
        $rootScope.max_price = $scope.userMaxPrice;
        $scope.refresh();
    }
    
    $scope.cancelFilters = function() {
        $scope.userMinPrice = $rootScope.min_price;
        $scope.userMaxPrice = $rootScope.max_price;
    }


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
    
    $ionicModal.fromTemplateUrl('templates/filters.html',function($ionicModal) {
        $scope.filtersModal = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-down'
    });
    $scope.openFilters = function() {
        $scope.filtersModal.show();
    }
    
  

    $scope.openCategories = function() {
        console.log('should open categories');
        $scope.catModal.show();
        console.log($scope.categories);
    };
    $scope.setCategory = function(cat) {
        if(cat === 'all') cat = '';
        $rootScope.products = [];
        $scope.catModal.hide();
        $rootScope.currentCategory = cat;
        $ionicLoading.show();
        $scope.refresh();
    }
    $scope.selectedCategory = function(idx) {
        console.log('selected category: ' + $scope.catNames[idx]);
        $scope.setCategory($scope.catNames[idx]);
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
    console.log($scope.categories);
   
 $scope.catNames = lodash.map(PriceAPI.categories[$rootScope.currentGender],function(cat) {
        return cat.name;
    });
    $scope.catNames.splice(0,0,'all');

})
.controller('heartCtrl',function($scope,$rootScope,Favs,lodash) {
    
     $scope.toggleFav = function(product) {
        console.log('should toggle fav');
//         console.log($rootScope.favs);

        var foundIt = Favs.contains(product);
        if(!foundIt) { //favorite not found; add it
            console.log('should add fav');
            Favs.add(product);
        } else { //favorite found; delete it
            console.log('should remove fav');
            Favs.remove(product);
        }
        product.isFavorite = !foundIt;
        Favs.getList();
    };
    
})

.controller('favoritesCtrl', function($scope, Favs) {
    $scope.$on('$ionicView.beforeEnter', function(){ 
        Favs.getList();
    });
    console.log('loaded fav controller!');
})


.controller('accountCtrl', function($scope,$cordovaFacebook,$state,localStorageService,$rootScope) {

    $scope.logout = function() {
        console.log('should logout...');
        $cordovaFacebook.logout().then(function(success) {
            localStorageService.remove('accessToken');
            localStorageService.remove('userId');
            localStorageService.remove('fullName');
            console.log(success);
            $state.go('signin');

        },function(error) {
           console.log('error logging out');
           console.log(error);
        });
    }
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

.controller('WelcomeCtrl',function($rootScope,$scope,$state,localStorageService,$cordovaFacebook,$http) {
    console.log('loaded welcome controller!');

    $scope.loginFacebook = function() {
        $cordovaFacebook.login(["public_profile", "email"])
    .then(function(success) {
        console.log('logged in!!!');
            console.log(success);
            localStorageService.set('accessToken',success.authResponse.accessToken);
            localStorageService.set('userId',success.authResponse.userID);
            $rootScope.user.id = localStorageService.get('userId');

        $cordovaFacebook.api("me", ["public_profile"])
        .then(function(success) {
            console.log(success);
            localStorageService.set('fullName',success.name);
            $rootScope.user.fullName = success.name;

            $state.go('tabs.feed');
        }, function (error) {
            // error
        });

        $http.get('https://graph.facebook.com/' + $rootScope.user.id + '/picture?redirect=false&width=500').then(function(res) {
            localStorageService.set('photoUrl',res.data.data.url);
            $rootScope.user.photoUrl = res.data.data.url;
              console.log('got photo!');
              console.log(res);
          },function(err) {
              console.log(err);
          });


        });
    }

})

.controller('LoginCtrl',function($rootScope,$scope,$state,$ionicLoading) {
    $scope.user = {};
    $scope.justRegistered = false;

$scope.login = function(provider) {
    console.log($scope.user);
    $ionicLoading.show({template: 'signing in...'});
    Ionic.Auth.login(authProvider, authSettings, $scope.user)
      .then(authSuccess, authFailure);
  };

  var authProvider = 'basic';
  var authSettings = { 'remember': $scope.remember };


  function authSuccess(user) {
      console.log(user);
        $ionicLoading.hide();

      $rootScope.user = user;
      $state.go('tabs.feed');
      if($scope.justRegistered) {
//         $state.go('shipping');
      } else {

        }
  };

  function authFailure(errors) {
        $ionicLoading.show({template: 'registering...'});
        Ionic.Auth.signup($scope.user).then(signupSuccess, signupFailure);
    };


  function signupSuccess(user) {
    $scope.justRegistered = true;
    console.log(user);
    $scope.login();
  }

  function signupFailure(response) {
      console.log('failed to sign up user');
      console.log(response);
  }


})
.controller('ShippingCtrl',function($rootScope,$scope,$state) {

    $scope.saveInfo = function() {
        $rootScope.user.save().then(function() {
            console.log('saved user');
            $state.go('tabs.feed');
        },function(error) {
            console.log('error saving user');
        });
    }

})
