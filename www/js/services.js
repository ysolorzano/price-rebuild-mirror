angular.module('app.services', ['ngResource','LocalStorageModule','ngLodash'])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function($http){

}])
.factory('PriceAPI',function($resource,$rootScope,$http,lodash,Favorites) {
    var hostUrl = $rootScope.hostUrl;
    $rootScope.currentGender = 'female';
     var catImg = [];
    for(i = 0; i < 6; i++)
        catImg.push('img/cats/' + $rootScope.currentGender + '/img' + (i+1).toString() + '.svg');
    return {
        item: $resource(hostUrl + '/item-details/:id/'),
        items: items,
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
                }],
            male: [
                {
                    name: 'electronics',
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
                    name: 'gear',
                    img: catImg[4]
                },{
                    name: 'sunglasses',
                    img: catImg[5]
                }]
        }
    }
    function items(page) {
        console.log('refresh products');
        var request = $http( {
            method: 'GET',
            url: $rootScope.hostUrl + '/item/list/',
            params: {
                'price_min' : $rootScope.min_price,
                'price_max' : $rootScope.max_price,
                'category' : $rootScope.currentCategory, //$rootScope.category
                'page': page,
                'show_by': '20',
                'type' : $rootScope.currentGender //$rootScope.gender


            }
        });
        return request.then( function(data) {
            console.log(data);
            return lodash.map(data.data[0].products,function(product) {
//                 product.fields.isFavorite = Favorites.contains(product.fields);
                return product.fields;
            });

            console.log($rootScope.products);
            $rootScope.$broadcast('scroll.refreshComplete');

            },
            function(e) {
                return e;
                console.log('error getting items...');
                console.log(e);
            });

    }
})
.factory('Favorites',function(localStorageService, $resource, $rootScope) {
    var hostUrl = $rootScope.hostUrl;

   return {
        get: function() {
          console.log('Fetching favorites...');
          return $resource(hostUrl + '/favourites/list/',
          {user: $rootScope.user.id})
          .query();
        },
        add: function(item) {
            return $resource(hostUrl + '/favourites/add',
            {item: '@item',user: $rootScope.user.id})
            .post({item : item});
        },
        delete: function(item) {
            console.log('deleting favorite...');
            return $resource(hostUrl + '/favourites/delete',
            {item:'@item',user: $rootScope.user.id})
            .post({item:item});
        },
        contains: function(item) {
            console.log('trying to get favorites!');
            var favs = localStorageService.get('favs');
            return favs.indexOf(item) != -1;
        }
       }
})

.factory('nFavorites',function(localStorageService, $resource, $rootScope) {
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
