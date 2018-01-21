(function() {

    var app = angular.module('hackathon.partials.basicSettingsController', []);
    app.controller('basicSettingsController', ['$scope', '$state', '$rootScope', 'authorservice', function($scope, $state, $rootScope, authorservice) {
            console.log('in settings controller');
            $scope.basicload = false;
            $scope.updateLoader = false;
            var getAuthorInfoPromise = authorservice.getAuthorInfo();
            getAuthorInfoPromise.then(function(response) {
                $scope.author = response;
                $scope.basicload = true;
                //console.log(response); 
            }, function(error) {
                console.log(error)
            });
            $scope.upload = function() {
                angular.element(document.querySelector('#fileInput')).click();
            };
            $scope.saveProfile = function() {
                var formData = new FormData();

                for (key in $scope.author) {
                    formData.append(key, $scope.author[key])
                }
                console.log(document.querySelector('#fileInput').files[0])
                formData.append('customAvatar', document.querySelector('#fileInput').files[0])
                $scope.updateLoader = true;
                var updateAuthorPromise = authorservice.updateAuthor(formData);
                updateAuthorPromise.then(function(response) {
                    $scope.updateLoader = false;
                    var notify = {
                        type: 'info',
                        title: 'Profile updated !',
                        timeout: 2000 //time in ms
                    };
                    $scope.$emit('notify', notify);
                    //$state.reload();
                }, function(error) {
                    $scope.updateLoader = false;
                    console.log(error);
                });
            }
        }])
        .factory("fileReader", function($q, $log) {
            var onLoad = function(reader, deferred, scope) {
                return function() {
                    scope.$apply(function() {

                        deferred.resolve(reader.result);
                    });
                };
            };

            var onError = function(reader, deferred, scope) {
                return function() {
                    scope.$apply(function() {
                        deferred.reject(reader.result);
                    });
                };
            };

            var onProgress = function(reader, scope) {
                return function(event) {
                    scope.$broadcast("fileProgress", {
                        total: event.total,
                        loaded: event.loaded
                    });
                };
            };

            var getReader = function(deferred, scope) {
                var reader = new FileReader();
                reader.onload = onLoad(reader, deferred, scope);
                reader.onerror = onError(reader, deferred, scope);
                reader.onprogress = onProgress(reader, scope);
                return reader;
            };

            var readAsDataURL = function(file, scope) {
                var deferred = $q.defer();

                var reader = getReader(deferred, scope);

                reader.readAsDataURL(file);

                return deferred.promise;
            };

            return {
                readAsDataUrl: readAsDataURL
            };
        });

})();