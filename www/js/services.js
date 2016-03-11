angular.module('app.services', ['ngResource','LocalStorageModule'])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function($http){
    
}])
.factory('PriceAPI',function($resource,$rootScope,$http) {
    var hostUrl = $rootScope.hostUrl;
     var catImg = [];
    for(i = 1; i < 6; i++)
        catImg.push('img/cats/' + $rootScope.currentGender + '/img' + (i+1).toString() + '.svg');
    return {
        item: $resource(hostUrl + '/item-details/:id/'),
        items: $resource(hostUrl + '/item/list/'),
        suggestions: $resource(hostUrl + '/item/similar-category/:id/'),
        suggestionstoo: function(id) { $http.get(hostUrl + '/item/similar-category/' + id + '/')
        },
        itemList: function() { $http( {
            method: 'GET',
            url: hostUrl + '/item/list/',
            params: {
                'min_price' : $rootScope.min_price,
                'max_price' : $rootScope.max_price,
                'category' : $rootScope.currentCategory, //$rootScope.category
                'page': $rootScope.page_no,
                'show_by': 10,
                'type' : 'female' //$rootScope.gender

            }
        })},
        categories: {
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
        }
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