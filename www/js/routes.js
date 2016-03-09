angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  .state('price.feed', {
    url: 'feed',
    views: {
      'tab5': {
        templateUrl: 'templates/feed.html',
        controller: 'feedCtrl'
      }
    }
  })

  .state('price.favorites', {
    url: 'favorites',
    views: {
      'tab2': {
        templateUrl: 'templates/favorites.html',
        controller: 'favoritesCtrl'
      }
    }
  })

  .state('price.account', {
    url: 'account',
    views: {
      'tab3': {
        templateUrl: 'templates/account.html',
        controller: 'accountCtrl'
      }
    }
  })
  .state('price.item', {
      url: 'product',
      templateUrl: 'templates/productDetails.html',
      controller: 'itemViewCtrl'
    })
    
    .state('price.splash', {
      url: 'splash',
      templateUrl: 'templates/welcome.html',
      controller: 'WelcomeCtrl'
    })

  .state('price', {
    url: '/',
    templateUrl: 'templates/price.html',
    abstract:true
  });
  


$urlRouterProvider.otherwise('feed')

  

});