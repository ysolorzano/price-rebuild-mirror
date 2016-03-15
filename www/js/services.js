angular.module('app.services', ['ngResource','LocalStorageModule','ngLodash'])


.factory('PriceAPI',function($resource,$rootScope,$http,lodash) {
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
    product.fields.isFavorite = lodash.some($rootScope.favs,function(fav) {
            return fav.itemID === product.fields.id;
        });        
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
.service('Favs', function($http,$rootScope) {
    return {
      add: add,
      list: list
    }

    function add(item) {
      var config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
      }
      var data = $.param({
        user: '76',
        item: item.id
      });
      var request = $http.post($rootScope.hostUrl + '/favourites/add', data, config);
      return (request.then(function(res) {
        console.log(res);
        return res.data;
      }, function(err) {
        return err;
      }));

    }

    function list() {
      var request = $http.get('http://staging12.getpriceapp.com' + '/favourites/list?user=76');
      return (request.then(function(res) {
          console.log('fetched favs...');
        console.log(res);
        return res.data;
      }, function(err) {
        return err;
      }));

    }
});