(function() {
    var app = angular.module('hackathon.service.authorservice', []);
    app.factory('authorservice', ['$http', '$q', function($http, $q) {
        return {
            getAuthorInfo: function() {
                var deferred = $q.defer();
                $http.get('/apidata/getAuthorInfo').then(function(result) {
                    deferred.resolve(result.data);
                }, function(err) {
                    deferred.reject(err.data);
                })
                return deferred.promise;
            },
            getAuthorPost: function(param) {
                var deferred = $q.defer();

                console.log('get author', param);
                var data = {
                    params: param
                };
                $http.get('/apidata/getAuthorPost', { params: { param: param } }).then(function(result) {

                    deferred.resolve(result.data);
                }, function(err) {
                    deferred.reject(err.data);
                })
                return deferred.promise;
            },
            updateAuthor: function(file) {
                var deferred = $q.defer();

                $http.post('/apidata/updateAuthor', file, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).then(function(result) {

                    deferred.resolve(result.data);
                }, function(err) {
                    deferred.reject(err.data);
                })
                return deferred.promise;
            },
            allAuthor: function() {
                var deferred = $q.defer();

                console.log('all author')
                $http.get('/apidata/allauthor').then(function(result) {
                    deferred.resolve(result.data);
                }, function(err) {
                    deferred.reject(err.data);
                })
                return deferred.promise;
            },
            filterAuthor: function(param) {
                var deferred = $q.defer();

                console.log('filter author')
                $http.get('/apidata/filterauthor', { param: param }).then(function(result) {
                    deferred.resolve(result.data);
                }, function(err) {
                    deferred.reject(err.data);
                })
                return deferred.promise;
            },
            authorPostsAll: function(param) {
                var deferred = $q.defer();

                console.log('get all posts from author')
                $http.get('/apidata/authorPostsAll').then(function(result) {

                    deferred.resolve(result.data);
                }, function(err) {
                    deferred.reject(err.data);
                })
                return deferred.promise;
            }
        }
    }])

})();