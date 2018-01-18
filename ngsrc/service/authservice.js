(function() {
    var app = angular.module('hackathon.service.authService', []);
    app.factory('authService', ['$http', '$q', 'AuthToken', function($http, $q, AuthToken) {
        return {
            login: function(user) {
                var deferred = $q.defer();
                $http.post('/apiauth/login', user).then(function(result) {
                    AuthToken.setToken(result.data.token)
                    deferred.resolve(result.data.user);
                }, function(err) {
                    deferred.reject(err.data);
                })
                return deferred.promise;
            },
            register: function(user) {
                var deferred = $q.defer();
                $http.post('/apiauth/register', user).then(function(result) {
                    AuthToken.setToken(result.data.token)
                    deferred.resolve(result.data.user);
                }, function(err) {
                    deferred.reject(err);
                })
                return deferred.promise;
            },
            logout: function() {
                var deferred = $q.defer();
                $http.delete('/apiauth/logout').then(function(result) {
                    AuthToken.removeToken();
                    deferred.resolve(result);

                }, function(err) {
                    deferred.reject('unable to connect to the internet');
                });
                return deferred.promise;
            },
            isLoggedIn: function() {
                if (AuthToken.getToken()) {
                    return true;
                } else
                    return false;
            },
            user: function() {
                var deferred = $q.defer();
                $http.get('/apiauth/me').then(function(result) {
                    deferred.resolve(result.data);
                }, function(err) {
                    deferred.reject(err);
                });
                return deferred.promise;
            }

        }

    }]);
    app.factory('AuthToken', ['$window', function($window) {
        var authToken = {};
        authToken.setToken = function(token) {
            $window.localStorage.setItem('token', token);
        }
        authToken.getToken = function() {
            return $window.localStorage.getItem('token');
        }
        authToken.removeToken = function() {
            $window.localStorage.removeItem('token');
        }
        return authToken;
    }]);
    app.factory('AuthInterceptors', ['AuthToken', function(AuthToken) {
        var authInterceptor = {};
        authInterceptor.request = function(config) {
            var token = AuthToken.getToken();
            if (token) {
                config.headers['x-auth'] = token;
            }
            return config;
        };
        return authInterceptor;
    }]);
})();