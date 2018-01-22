(function() {
    var app = angular.module('hackathon.service.postservice', []);
    app.factory('postservice', ['$http', '$q', function($http, $q) {
        return {
            getPost: function(param) {
                var deferred = $q.defer();

                console.log('get post')
                $http.get('/apidata/getPost', { params: { param: param } }).then(function(result) {

                    deferred.resolve(result.data);
                }, function(err) {
                    deferred.reject(err.data);
                })
                return deferred.promise;
            },
            createPost: function(file) {
                var deferred = $q.defer();
                $http.post('/apidata/createpost', file, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }).then(function(result) {
                    deferred.resolve(result.data.post);
                }, function(err) {
                    deferred.reject(err.data);
                })
                return deferred.promise;
            },
            allPost: function() {
                var deferred = $q.defer();

                $http.get('/apidata/allpost').then(function(result) {
                    deferred.resolve(result.data);
                }, function(err) {
                    deferred.reject(err.data);
                })
                return deferred.promise;
            },
            filterkeys: function(param) {
                var deferred = $q.defer();

                console.log('create filter', param)
                $http.post('/apidata/filterkeys', { param: param }).then(function(result) {
                    deferred.resolve(result.data);
                }, function(err) {
                    deferred.reject(err.data);
                })
                return deferred.promise;
            },
            getfilterkeys: function(param) {
                var deferred = $q.defer();
                $http.get('/apidata/getfilterkeys').then(function(result) {
                    deferred.resolve(result.data);
                }, function(err) {
                    deferred.reject(err.data);
                })
                return deferred.promise;
            },
            filterPost: function(param) {
                var deferred = $q.defer();

                console.log('create post')
                $http.get('/apidata/filterpost', { params: { param: param } }).then(function(result) {
                    deferred.resolve(result.data);
                }, function(err) {
                    deferred.reject(err.data);
                })
                return deferred.promise;
            },
            deletePost: function(param) {
                var deferred = $q.defer();

                console.log('delete post')
                $http.delete('/apidata/deletePost', { params: { param: param } }).then(function(result) {
                    console.log(result, 'deleted')
                    deferred.resolve(result.data);
                }, function(err) {
                    deferred.reject(err.data);
                });
                return deferred.promise;
            }
        }
    }])

})();