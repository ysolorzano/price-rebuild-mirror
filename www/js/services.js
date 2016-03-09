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

.factory('Favorites',function(localStorageService) {
    if(!localStorageService.get('favs'))
        localStorageService.set('favs',[]);
   return {
        get: function() {
            return localStorageService.get('favs')
        },
        add: function(item) { 
            console.log('added item!');
           var favs = localStorageService.get('favs');
           favs.push(item);
           localStorageService.set('favs',favs);
        },
        delete: function(item) {
            var favs = localStorageService.get('favs');
            var index = favs.indexOf(item);
            favs.splice(index, 1);
            localStorageService.set('favs',favs);
        },
        contains: function(item) {
            console.log('trying to get favorites!');
            var favs = localStorageService.get('favs');
            return favs.indexOf(item) != -1;
        }
       }
});