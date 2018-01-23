(function() {
    var app = angular.module('hackathon.core.createPostController', []);
    app.controller('createPostController', ['$scope', 'textAngularManager', 'postservice', '$rootScope', '$window', function($scope, textAngularManager, postservice, $rootScope, $window) {
        console.log('in createPostController');
        $scope.version = textAngularManager.getVersion();
        $scope.versionNumber = $scope.version.substring(1);
        $scope.htmlcontent = '';
        $scope.blogHeader = '';
        //$scope.tempData = {};
        $scope.upload = function() {
            angular.element(document.querySelector('#bannerInput')).click();
        };

        $scope.optionSelected = false;
        $scope.showCreator = function(param) {

            $scope.optionSelected = true;
            if (param == 'post')
                $scope.postCreator = true
            else
                $scope.postCreator = false

        }
        $scope.showOptions = function() {
            $scope.optionSelected = false;
        }

        // console.log(angular.element(document.querySelector('.btn-toolbar').getBoundingClientRect().top))

        window.onscroll = function() {
            var top = angular.element(document.querySelector('.btn-toolbar').getBoundingClientRect().top);
            var txTop = angular.element(document.querySelector('.ta-bind').getBoundingClientRect().top);
            if (top[0] < 66 && txTop[0] < 115) {
                angular.element(document.querySelector('.btn-toolbar')).addClass('fixed');
                angular.element(document.querySelector('.topbar--option--fixed')).addClass('fixed');

            } else {
                angular.element(document.querySelector('.btn-toolbar')).removeClass('fixed');
                angular.element(document.querySelector('.topbar--option--fixed')).removeClass('fixed');
            }
        };
        $scope.disabled = false;
        $scope.savePost = function() {
            //$scope.htmlPost = $scope.htmlcontent;
            var formData = new FormData();
            console.log($scope.blogHeader, '----psot')
            var tempData = {
                "heading": $scope.blogHeader,
                "alias": $scope.blogHeader.split(' ').join('-'),
                "body": $scope.htmlcontent,
                "tags": ["angular", "css"],
                "banner": document.querySelector('#bannerInput').files[0] || '',
                "difficulty": "easy",
                "likes": 0,
                "shares": 0,
                "views": 0,
                "claps": 0,
                "type": "tutorial",
                "readtime": 3,
                "dateadded": Date.now(),
                "status": "pending",
                "user": "",
                "comments": ""
            }

            for (key in tempData) {
                formData.append(key, tempData[key])
            }
            var createPostPromise = postservice.createPost(formData);
            createPostPromise.then(function(response) {
                    console.log(response);
                    var notify = {
                        type: 'info',
                        title: 'Post Created!',
                        timeout: 2000 //time in ms
                    };
                    $scope.$emit('notify', notify);
                }, function(err) {
                    console.log(err)
                })
                //console.log($scope.htmlcontent);
        }
        $scope.saveArticle = function() {
            //$scope.htmlPost = $scope.htmlcontent;
            var formData = new FormData();

            var tempData = {
                "heading": $scope.articleBlogHeader,
                "alias": $scope.articleBlogHeader.split(' ').join('-'),
                "body": $scope.articleHtmlContent,
                "tags": ["angular", "css"],
                "difficulty": "easy",
                "likes": 0,
                "shares": 0,
                "views": 0,
                "claps": 0,
                "type": "article",
                "readtime": 3,
                "dateadded": Date.now(),
                "status": "pending",
                "user": "",
                "comments": ""
            }

            for (key in tempData) {
                formData.append(key, tempData[key])
            }
            var createPostPromise = postservice.createPost(formData);
            createPostPromise.then(function(response) {
                    console.log(response);
                    var notify = {
                        type: 'info',
                        title: 'Post Created!',
                        timeout: 2000 //time in ms
                    };
                    $scope.$emit('notify', notify);
                }, function(err) {
                    console.log(err)
                })
                //console.log($scope.htmlcontent);
        }

        $scope.imageSrc = "";
        $scope.$on("fileProgress", function(e, progress) {
            $scope.progress = progress.loaded / progress.total;
        });
    }]);
    app.directive("ngFileSelect", function(fileReader, $timeout) {
        return {
            scope: {
                ngModel: '='
            },
            link: function($scope, el) {
                function getFile(file) {
                    fileReader.readAsDataUrl(file, $scope)
                        .then(function(result) {
                            $timeout(function() {
                                $scope.ngModel = result;
                            });
                        });
                }

                el.bind("change", function(e) {
                    var file = (e.srcElement || e.target).files[0];
                    getFile(file);
                });
            }
        };
    });

    app.factory("fileReader", function($q, $log) {
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