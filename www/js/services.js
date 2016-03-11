angular.module('app.services', ['ngResource','LocalStorageModule'])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function($http){

}])
.factory('PriceAPI',function($resource,$rootScope,$http) {
    var hostUrl = $rootScope.hostUrl;
    return {
        item: $resource(hostUrl + '/item-details/:id/'),
        items: $resource(hostUrl + '/item/list/'),
        suggestions: $resource(hostUrl + '/item/similar-category/:id/'),
        itemList: function() { $http( {
            method: 'get',
            url: hostUrl + '/item/list/',
            params: {
                'min_price' : $rootScope.min_price,
                'max_price' : $rootScope.max_price
            },
            data: {
                'category' : 'jewelry', //$rootScope.category
                'page':$rootScope.page_no,
                'show_by': 10,
                'type' : 'female' //$rootScope.gender
            }
        })}
    }
})
.factory('Favorites',function(localStorageService, $resource, $rootScope) {
    var hostUrl = $rootScope.hostUrl;

    if(!localStorageService.get('favs'))
        localStorageService.set('favs',[]);
   return {
        get: function() {
          url = hostUrl + '/favourites/list/'
          console.log('Fetching favorites...')
          return $resource(url, {user: 76}, {
              query: {method:'POST', isArray:true}
            });
        },
        add: function(item, userId) {
          url = hostUrl + '/favourites/add'
          console.log('adding favorite...');
          console.log(item);
          return $resource(url, {user: 76, item: 9367}, {
              query: {method:'GET', params: {user: userId, item: item.id}}
            });
        },
        delete: function(item, userId) {
          url = hostUrl + '/favourites/delete'
          console.log('deleting favorite...');
          console.log(item);
          return $resource(url, {user: 76, item: 9367}, {
              query: {method:'POST', params: {user: userId, item: item.id}}
            });
        },
        contains: function(item) {
            console.log('trying to get favorites!');
            var favs = localStorageService.get('favs');
            return favs.indexOf(item) != -1;
        }
       }
});
