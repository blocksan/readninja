(function() {
    var app = angular.module('hackathon.core.createPostController', []);
    app.controller('createPostController', ['$scope', 'textAngularManager', 'postservice', '$rootScope', '$window', '$state', function($scope, textAngularManager, postservice, $rootScope, $window, $state) {
        console.log('in createPostController');
        $scope.optionSelected = false;
        $scope.htmlcontent = '';
        $scope.blogHeader = '';

        $scope.readarray = ('< 3 mins | 3- 5 mins | 5 - 10 mins | > 10 mins').split('|');
        $scope.difficult = ('Easy Medium Hard').split(' ');

        $scope.disabled = false;
        $scope.postTemp = {};

        var self = this;

        self.readonly = false;
        self.selectedItem = null;
        self.searchText = null;
        self.querySearch = querySearch;
        self.technogolies = loadTechnologies();
        $scope.techs = [];
        self.numberChips = [];
        self.numberChips2 = [];
        self.numberBuffer = '';
        self.autocompleteDemoRequireMatch = true;
        self.transformChip = transformChip;

        //$scope.tempData = {};
        $scope.upload = function() {
            angular.element(document.querySelector('#bannerInput')).click();
        };



        $scope.showCreator = function(param) {
            resetForm();
            $scope.optionSelected = true;
            if (param == 'post') {
                $scope.postCreator = true
            } else {

                $scope.postCreator = false
            }
        }

        $scope.showOptions = function() {
            $scope.optionSelected = false;
            resetForm();
        }

        $scope.savePost = function() {
            var formData = new FormData();
            var tempData = {
                "heading": $scope.blogHeader,
                "alias": $scope.blogHeader.split(' ').join('-'),
                "body": $scope.htmlcontent,
                "likes": 0,
                "shares": 0,
                "views": 0,
                "claps": 0,
                "type": "article",
                "dateadded": Date.now(),
                "status": "pending",
                "user": "",
                "comments": ""
            }

            if ($scope.postCreator) {
                tempData.banner = document.querySelector('#bannerInput').files[0] || '';
                tempData.readtime = $scope.postTemp.readt;
                tempData.difficulty = $scope.postTemp.diffi;
                tempData.type = 'tutorial';
                tempData.tags = $scope.techs;
            }

            for (key in tempData) {
                formData.append(key, tempData[key])
            }
            postservice.createPost(formData).then(function(response) {
                var notify = {
                    type: 'info',
                    title: 'Post Created!',
                    timeout: 2000 //time in ms
                };
                $scope.$emit('notify', notify);
                $state.reload();
            }, function(err) {
                var notify = {
                    type: 'error',
                    title: 'Oops something went wrong!',
                    timeout: 2000 //time in ms
                };
                $scope.$emit('notify', notify);
            })
        }

        function resetForm() {
            $scope.blogHeader = null;
        }

        /**
         * Return the proper object when the append is called.
         */
        function transformChip(chip) {
            // If it is an object, it's already a known chip
            if (angular.isObject(chip)) {
                return chip;
            }

            // Otherwise, create a new one
            return { name: chip, type: 'new' }
        }

        /**
         * Search for technogolies.
         */
        function querySearch(query) {
            var results = query ? self.technogolies.filter(createFilterFor(query)) : [];
            return results;
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(vegetable) {
                return (vegetable._lowername.indexOf(lowercaseQuery) === 0);
            };

        }

        function loadTechnologies() {
            var techs = [{ name: 'CSS3' }, { name: 'HTML' }, { name: 'Angularjs' }, { name: 'MEAN' }, { name: 'Php' }, { name: 'Selenium' }, { name: 'JAVA' }, { name: 'Heroku' }, { name: 'AWS' }, { name: 'Digital Ocean' }, { name: 'Google Cloud' }];

            return techs.map(function(tech) {
                tech._lowername = tech.name.toLowerCase();
                return tech;
            });
        }



        // console.log(angular.element(document.querySelector('.btn-toolbar').getBoundingClientRect().top))
        if ($state.current.name == 'home.newpost') {
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
        }


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