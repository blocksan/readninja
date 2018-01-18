(function() {
    var app = angular.module('hackathon.core.createPostController', []);
    app.controller('createPostController', ['$scope', 'textAngularManager', 'postservice', '$rootScope', '$window', function($scope, textAngularManager, postservice, $rootScope, $window) {
        console.log('in createPostController');
        $scope.version = textAngularManager.getVersion();
        $scope.versionNumber = $scope.version.substring(1);
        $scope.orightml = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><img class="ta-insert-video" ta-insert-video="http://www.youtube.com/embed/2maA1-mvicY" src="" allowfullscreen="true" width="300" frameborder="0" height="250"/></p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE9+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p><h4>Supports non-latin Characters</h4><p>昮朐 魡 燚璒瘭 譾躒鑅, 皾籈譧 紵脭脧 逯郹酟 煃 瑐瑍, 踆跾踄 趡趛踠 顣飁 廞 熥獘 豥 蔰蝯蝺 廦廥彋 蕍蕧螛 溹溦 幨懅憴 妎岓岕 緁, 滍 蘹蠮 蟷蠉蟼 鱐鱍鱕, 阰刲 鞮鞢騉 烳牼翐 魡 骱 銇韎餀 媓幁惁 嵉愊惵 蛶觢, 犝獫 嶵嶯幯 縓罃蔾 魵 踄 罃蔾 獿譿躐 峷敊浭, 媓幁 黐曮禷 椵楘溍 輗 漀 摲摓 墐墆墏 捃挸栚 蛣袹跜, 岓岕 溿 斶檎檦 匢奾灱 逜郰傃</p>';
        $scope.htmlcontent = '';
        $scope.blogHeader = '';
        //$scope.tempData = {};
        $scope.upload = function() {
            angular.element(document.querySelector('#bannerInput')).click();
        };

        // console.log(angular.element(document.querySelector('.btn-toolbar').getBoundingClientRect().top))

        window.onscroll = function() {
            var top = angular.element(document.querySelector('.btn-toolbar').getBoundingClientRect().top);
            var txTop = angular.element(document.querySelector('.ta-bind').getBoundingClientRect().top);
            if (top[0] < 66 && txTop[0] < 115) {
                angular.element(document.querySelector('.btn-toolbar')).addClass('fixed');
            } else {
                angular.element(document.querySelector('.btn-toolbar')).removeClass('fixed');
            }
        };
        $scope.disabled = false;
        $scope.saveText = function() {
            //$scope.htmlPost = $scope.htmlcontent;
            var formData = new FormData();

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