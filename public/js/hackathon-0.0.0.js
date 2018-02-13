/*! readninja - v0.0.0 - 2018-02-14 */(function() {
    'use strict';
    var app = angular.module('hackathon', [
            'ngMaterial',
            'ngMessages',
            'ui.router',
            'cloudinary',
            'ngAnimate',
            'angular-loading-bar',
            'mdCollectionPagination',
            'textAngular',
            'angularNotify',
            'hackathon.core.landingController',
            'hackathon.core.dashboardController',
            'hackathon.core.filterController',
            'hackathon.core.profileController',
            'hackathon.core.contentController',
            'hackathon.core.homeController',
            'hackathon.core.createPostController',
            'hackathon.route.route',
            'hackathon.service.postservice',
            'hackathon.service.authorservice',
            'hackathon.service.authService',
            'hackathon.partials.basicSettingsController',
            'hackthaon.partials.postsController',
            'hackathon.directive.prismdirective',
            'hackathon.core.writerController',
            /* 'ngDialog', */
            /* 'ui.bootstrap', */
            'ui.router.state.events',
        ])
        .constant('_', window._).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {}])
        /* .config(function($provide) {
            $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions) { // $delegate is the taOptions we are decorating
                taOptions.toolbar = [
                    ['h1', 'h2', 'p', 'pre', 'quote'],
                    ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],

                    ['html', 'insertImage', 'insertLink', 'insertVideo', 'wordcount', 'charcount']
                ];
                return taOptions;
            }]);
        }) */
        .config(['$provide',
            function($provide) {
                var http = angular.injector(['ng']).get('$http');
                $provide.decorator('taOptions', ['taRegisterTool', '$mdDialog', '$delegate',
                    function(taRegisterTool, $mdDialog, taOptions) {
                        taOptions.toolbar = [
                            ['clear', 'h1', 'h2', 'h3', 'p', 'pre', 'quote'],
                            ['ul', 'ol'],
                            ['bold', 'italics'],
                            ['insertLink']
                        ];
                        /* taOptions.toolbar = [
                            ['h1', 'h2', 'p', 'pre', 'quote'],
                            ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],

                            ['html', 'insertLink', 'insertVideo', 'wordcount', 'charcount']
                        ];
 */
                        // Create our own insertImage button
                        taRegisterTool('customInsertImage', {
                            iconclass: "fa fa-picture-o",
                            action: function($deferred, $http) {
                                var textAngular = this;
                                var savedSelection = rangy.saveSelection();
                                $mdDialog.show({
                                        template: '<input id="previewImg" type="file" class="file--uploader--hide" onchange="angular.element(this).scope().fileNameChanged()" style="display:none"><md-button class="md-raised " ng-click="submit()" style="margin:0;text-transform:Capitalise;padding: 10px 10px;">  Upload  &nbsp;&nbsp;<md-progress-circular class="md-accent"  style="display:inline" md-mode="indeterminate" md-diameter="20px" ng-show="imgLoad"></md-progress-circular> </md-button>',
                                        parent: angular.element(document.body),
                                        clickOutsideToClose: true,
                                        controller: ['$scope',
                                                function($scope) {
                                                    $scope.imgLoad = false;
                                                    $scope.submit = function() {

                                                        angular.element(document.querySelector('#previewImg')).click();
                                                        $scope.imgLoad = true;

                                                    };
                                                    $scope.fileNameChanged = function() {

                                                        var formData = new FormData;
                                                        var file   = document.querySelector('#previewImg').files[0]; 
                                                        formData.append('image', file);

                                                        http.post('/apidata/savePostContentImg', formData, {

                                                            transformRequest: angular.identity,
                                                            headers: { 'Content-Type': undefined }
                                                        }).then(function(result) {
                                                            $scope.imgLoad = false;
                                                            $mdDialog.hide(result.data); 
                                                        }, function(err) {
                                                            $scope.imgLoad = false;
                                                            alert(err)
                                                        })

                                                    };

                                                }
                                            ] // Only for -xs, -sm breakpoints.
                                    })
                                    .then(function(imgUrl) {

                                        rangy.restoreSelection(savedSelection);
                                        textAngular.$editor().wrapSelection('insertImage', imgUrl);
                                        $deferred.resolve();
                                    }, function() {});
                                return false;
                            },
                        });

                        // Now add the button to the default toolbar definition
                        // Note: It'll be the last button
                        taOptions.toolbar[3].push('customInsertImage');
                        return taOptions;
                    }
                ]);
            }
        ])
        .config(function($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('green')
                .accentPalette('indigo');
            $mdThemingProvider.theme('input', 'default')
                .primaryPalette('grey')
        });
    app.run(['$rootScope', '$window', function($rootScope, $window) {
        //$rootScope.showOnce = true;
        if ($window.localStorage.getItem('portfolioFox')) {
            $rootScope.showOnce = false;
        } else {
            $rootScope.showOnce = true;
            $window.localStorage.setItem('portfolioFox', true)
        }
    }]);
    app.run(['$rootScope', '$state', '$location', 'authService', '$window', function($rootScope, $state, $location, authService, $window) {
        $rootScope.$on('$stateChangeStart', function(event, next, nextParams, fromState) {

            /* if ($window.innerWidth >= 1280) {
                $rootScope.imgHeight = 372;
                $rootScope.imgWidth = 270;
                $rootScope.imgThumbHeight = 140;
                $rootScope.imgThumbWidth = 100;
                $rootScope.imgSingleHeight = 630;
                $rootScope.imgSingleWidth = 470;
                $rootScope.imgSmallThumbHeight = 53;
                $rootScope.imgSmallThumbWidth = 53;
                $rootScope.imgCartHeight = 96;
                $rootScope.imgCartWidth = 70;
            } else if ($window.innerWidth >= 768 && $window.innerWidth < 1280) {
                $rootScope.imgHeight = 356;
                $rootScope.imgWidth = 258;
                $rootScope.imgThumbHeight = 140;
                $rootScope.imgThumbWidth = 100;
                $rootScope.imgSingleHeight = 605;
                $rootScope.imgSingleWidth = 450;
                $rootScope.imgSmallThumbHeight = 53;
                $rootScope.imgSmallThumbWidth = 53;
                $rootScope.imgCartHeight = 96;
                $rootScope.imgCartWidth = 70;
            } else {
                $rootScope.imgHeight = 185;
                $rootScope.imgWidth = 134;
                $rootScope.imgThumbHeight = 110;
                $rootScope.imgThumbWidth = 82;
                $rootScope.imgSingleHeight = 372;
                $rootScope.imgSingleWidth = 278;
                $rootScope.imgSmallThumbHeight = 53;
                $rootScope.imgSmallThumbWidth = 53;
                $rootScope.imgCartHeight = 96;
                $rootScope.imgCartWidth = 70;
            } */
            $rootScope.search_toggle = true;
            if (next.name == 'home.newpost' || next.name == 'home.profile.posts' || next.name == 'home.profile.home' || next.name == 'home.profile.settings')
                $rootScope.hideFooter = true;
            else
                $rootScope.hideFooter = false;
            if (authService.isLoggedIn()) {

                var userPromise = authService.user();
                userPromise.then(function(result) {
                    $rootScope.user = result;
                    $rootScope.logged = true;
                });
            } else {
                $rootScope.logged = false;
            }

        });
    }]);
    app.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.interceptors.push('AuthInterceptors');
        $httpProvider.interceptors.push(function($q) {
            return {

                'responseError': function(rejection) {

                    var defer = $q.defer();

                    if (rejection.status == 401) {
                        window.localStorage.removeItem('token');
                        window.location = "/";

                    }

                    defer.reject(rejection);

                    return defer.promise;

                }
            };
        });
    }]);
    app.config(['cloudinaryProvider', function(cloudinaryProvider) {
        cloudinaryProvider
            .set("cloud_name", "ersan")
            .set("secure", true)
    }]);

    /* app.config(['$crypthmacProvider', function($crypthmacProvider) {
        $crypthmacProvider.setCryptoSecret('8BLOpr0p');
    }]) */

})();

(function() {

    var app = angular.module('hackathon.core.contentController', []);
    app.controller('contentController', ['$scope', '$stateParams', 'textAngularManager', 'postservice', 'authorservice', function($scope, $stateParams, textAngularManager, postservice, authorservice) {
        console.log('in content controller');
        $scope.loaded = false;
        $scope.content = false;
        $scope.version = textAngularManager.getVersion();
        $scope.versionNumber = $scope.version.substring(1);
        $scope.orightml = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><img class="ta-insert-video" ta-insert-video="http://www.youtube.com/embed/2maA1-mvicY" src="" allowfullscreen="true" width="300" frameborder="0" height="250"/></p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE9+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p><h4>Supports non-latin Characters</h4><p>昮朐 魡 燚璒瘭 譾躒鑅, 皾籈譧 紵脭脧 逯郹酟 煃 瑐瑍, 踆跾踄 趡趛踠 顣飁 廞 熥獘 豥 蔰蝯蝺 廦廥彋 蕍蕧螛 溹溦 幨懅憴 妎岓岕 緁, 滍 蘹蠮 蟷蠉蟼 鱐鱍鱕, 阰刲 鞮鞢騉 烳牼翐 魡 骱 銇韎餀 媓幁惁 嵉愊惵 蛶觢, 犝獫 嶵嶯幯 縓罃蔾 魵 踄 罃蔾 獿譿躐 峷敊浭, 媓幁 黐曮禷 椵楘溍 輗 漀 摲摓 墐墆墏 捃挸栚 蛣袹跜, 岓岕 溿 斶檎檦 匢奾灱 逜郰傃</p>';
        $scope.htmlcontent = '';
        $scope.disabled = false;
        $scope.saveText = function() {
            var data = {
                "heading": "My First Post",
                "body": "<p><br></p><p><img src='https://cdn.scotch.io/272/g2A1PWWS0KmiR9E3t5w3_Angular%20-%20Shortcut%20to%20Import%20Your%20Styles%20Files%20in%20Component%201.png.jpg' style='font-size: 1.2em;width: 100%;'><span style='font-size: 1.2em;'>​</span></p><p></p><p>Hello this is my first tutorial</p><p></p><p></p>",
                "tags": ["angular", "css"],
                "banner": "2.png",
                "difficulty": "easy",
                "likes": 0,
                "shares": 0,
                "views": 0,
                "claps": 0,
                "type": "tutorial",
                "readtime": 3,
                "dateadded": "3 Jan 2017",
                "status": "pending",
                "user": "",
                "comments": [""]
            }
            var postPromise = postservice.createPost(data, 'ninjasan');
            postPromise.then(function(response) {
                console.log(response)
            }, function(err) {
                console.log(err)
            })
        }
        $scope.createAuthor = function() {
            var data = {
                "name": "alfedo",
                "username": "alfredo",
                "tagline": "I will hustle more rather than settle",
                "avatar": "/avatar.png",
                "email": "me@sandeepghosh.com",
                "password": "admin",
                "website": "www.readninja.com",
                "bio": "I am a part time writer, machine learning enthusiasts and MEAN stack developer",
                "gitU": "",
                "instaU": "",
                "fbU": "",
                "twitU": "",
                "numberposts": 0,
                "likes": 0,
                "claps": 0,
                "tags": ["angularjs", "css", "js"]

            }
            var authorPromise = authorservice.createAuthor(data);
            authorPromise.then(function(response) {
                console.log(response)
            }, function(err) {
                console.log(err)
            })
        }
        $scope.$watch('htmlcontent', function(newValue, oldValue) {

            var str = newValue;
            var res = str.match(/<pre>/g);
            //res = res + 
        });
        //$scope.allPost = function() {
        var allPostPromise = postservice.allPost();
        allPostPromise.then(function(response) {
            $scope.posts = response;

            //console.log(response, 'all post')
        }, function(error) {
            console.log(error)
        });
        var allAuthorPromise = authorservice.allAuthor();
        allAuthorPromise.then(function(response) {
            //console.log(response)
        }, function(error) {
            console.log(error)
        });
        var author_id_mongo = "5a5451d88f8ada2db029cd13" //for ninjasan
        var getAuthorPromise = authorservice.getAuthorPost(author_id_mongo);
        getAuthorPromise.then(function(response) {
            //$scope.post=response;
            //console.log(response, 'author data')
        }, function(error) {
            console.log(error)
        });




        // var post_id_mongo = "5a5451d88f8ada2db029cd13"
        /* var tags = ["Angular", "Angular2", "CSS", "Javascript", "PHP", "MongoDB", "HTML", "CSS3"]
        var category = ["Tutorial", "Article"]
        var difficulty = ["Easy", "Intermediate", "Advance"]
        var readtime = [3, 4, 7, 10, 5]
        var filterData = {
            tags: tags,
            category: category,
            difficulty: difficulty,
            readtime: readtime
        }
        var filterInsertPromise = postservice.filterkeys(filterData);
        filterInsertPromise.then(function(response) {
            console.log(response, 'post data')
        }, function(error) {
            console.log(error)
        }); */




        //}
        if ($stateParams.keyword) {
            var post_heading = $stateParams.keyword;
            post_heading = post_heading.split(' ').join('-')
            var getPostPromise = postservice.getPost(post_heading);
            getPostPromise.then(function(response) {
                    if (response[0]) {
                        $scope.post = response[0];
                        $scope.author = response[0].user;
                        $scope.content = true;
                    } else
                        $scope.content = false;
                    $scope.loaded = true;
                },
                function(error) {
                    console.log(error)
                });
            var viewPostPromise = postservice.viewPost(post_heading);
            viewPostPromise.then(function(response) {
                console.log(response, 'viewed post')
            }, function(error) {
                console.log(error)
            });
        } else {
            $scope.content = false;
            $scope.loaded = true;
        }

        $scope.clapPost = function() {
            var clapPostPromise = postservice.clapPost($scope.post.alias);
            clapPostPromise.then(function(response) {
                console.log(response)
                $scope.post.claps = response.claps;
            }, function(error) {
                console.log(error)
            });
        }

    }]);
})();

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

(function() {

    var app = angular.module('hackathon.core.dashboardController', []);
    app.controller('dashboardController', ['$scope', '$window', '$state', '$rootScope', 'postservice', function($scope, $window, $state, $rootScope, postservice) {
        console.log('in dashboard controller');

        $scope.showOnceDash = function() {

            $window.localStorage.removeItem('portfolioFox');
            $window.location.reload();
        };
        var allPostPromise = postservice.allPost('all');
        allPostPromise.then(function(response) {
            $scope.firstRow = response.slice(0, 3);
            $scope.secondRow = response.slice(3, 7);
            $scope.thirdRow = response.slice(7, 10);


        }, function(error) {
            console.log(error)
        });
        var trendingPostPromise = postservice.trendingPost();
        trendingPostPromise.then(function(response) {
            $scope.trendingRow = response;
        }, function(error) {
            console.log(error)
        });

        angular.element(document).ready(function() {

            var typed3 = new Typed('#headerTagLine', {
                strings: ['what we do : <strong> EAT ! </strong>', 'what we do : <strong> SLEEP ! </strong>', 'what we do : <strong> POST ! </strong>', 'what we do : <strong> REPEAT ! </strong>'],
                typeSpeed: 100,
                backSpeed: 20,
                smartBackspace: true, // this is a default
                loop: true
            });

        });
    }]);

})();

(function() {

    var app = angular.module('hackathon.core.filterController', []);
    app.controller('filterController', ['$scope', '$stateParams', '$state', '$rootScope', '$mdSidenav', 'postservice', function($scope, $stateParams, $state, $rootScope, $mdSidenav, postservice) {
        console.log('in filter controller');
        /**
         * Supplies a function that will continue to operate until the
         * time is up.
         */
        $scope.filteredUsers = [];
        $scope.loading = true;

        function debounce(func, wait, context) {
            var timer;

            return function debounced() {
                var context = $scope,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function() {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }

        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        function buildDelayedToggler(navID) {
            return debounce(function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle()
                    .then(function() {
                        $log.debug("toggle " + navID + " is done");
                    });
            }, 200);
        }



        $scope.users = [];
        var param = "tutorial";
        if ($stateParams.keyword == 'article') {
            param = $stateParams.keyword;
            $scope.filterHide = true;
        } else {
            param = param;
            $scope.filterHide = false;
        }
        var allPostPromise = postservice.allPost(param);
        allPostPromise.then(function(response) {

            $scope.loading = false;
            $scope.posts = response;
            /* response.forEach((obj, i) => {
                console.log(obj, i)
                $scope.users[i] = obj.heading

            }); */
            $scope.users = response;
            //console.log(response, 'all post');

            $scope.filteredUsers = $scope.users;
            $scope.searchString = '';

            //console.log(response);

            $scope.search = function() {
                let nameRegexp = new RegExp($scope.searchString, 'i');
                console.log($scope.users, '---', nameRegexp)
                $scope.filteredUsers = $scope.users.filter(user => user.heading.match(nameRegexp));
            }

        }, function(error) {
            console.log(error)
        });
        //$scope.users = [];
        /* $scope.posts.forEach((obj, i) => {
            $scope.users[i] = obj.heading

        }); */

        //$scope.users = ['Fabio2', 'Leonardo1', 'Fabi2o', 'Leo3nardo', 'Fa11bio', 'Leonardo', 'Thomas', 'Gabriele', 'Fabrizio', 'John', 'Luis', 'Kate', 'Max'];





        var getfilterPromise = postservice.getfilterkeys();
        getfilterPromise.then(function(response) {
            $scope.filters = response[0]
        }, function(error) {
            console.log(error)
        });

        $scope.selectedCat = [];
        $scope.selectedTag = [];
        $scope.selectedEye = "";
        $scope.selectedDifficulty = "";
        $scope.toggleCat = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            } else {
                list.push(item);
            }
            console.log(list, ' category')
        };

        $scope.existsCat = function(item, list) {
            return list.indexOf(item) > -1;
        };
        $scope.toggleTag = function(item, list) {
            var idx = list.indexOf(item);
            if (idx > -1) {
                list.splice(idx, 1);
            } else {
                list.push(item);
            }
            console.log(list, ' tags')
        };

        $scope.existsTag = function(item, list) {
            return list.indexOf(item) > -1;
        };
        $scope.toggleEye = function(item) {

            $scope.selectedEye = item;
            console.log($scope.selectedEye)
        };
        $scope.toggleDifficult = function(item) {

            $scope.selectedDifficulty = item;
            console.log($scope.selectedDifficulty)

        };

        $scope.toggleSideNav = function() {
            $mdSidenav('left').toggle();
        }



    }]);

})();

(function() {

    var app = angular.module('hackathon.core.homeController', []);
    app.controller('homeController', ['$scope', '$state', '$rootScope', function($scope, $state, $rootScope) {
        console.log('in home controller');

    }]);

})();

(function() {

    var app = angular.module('hackathon.core.landingController', []);
    app.controller('landingController', ['$scope', '$state', '$rootScope', '$mdDialog', '$http', 'authService', '$mdDialog', 'postservice', function($scope, $state, $rootScope, $mdDialog, $http, authService, $mdDialog, postservice) {
        console.log('in landing controller');
        $rootScope.search_toggle = true;
        $scope.registerError = {
            status: false,
            message: ""
        };
        $scope.toggleSearch = function(param) {
            $rootScope.search_toggle = param ? true : !$rootScope.search_toggle;
        }

        //saerch bar
        // var itemList = ["header", "header-of-the-new-blog", "demo purpose"]
        var itemList = "";
        var itemListPromise = postservice.allPostName();
        itemListPromise.then(function(response) {
            itemList = response;
        }, function(error) {
            console.log(error)
        })

        $scope.copyList = angular.copy(itemList)
        $scope.searchContent = function(text) {
            $scope.noresult = false;
            if (text.length) {
                let searchRegx = new RegExp(text, 'i');
                $scope.copyList = itemList.filter(function(item) {
                    return item.heading.match(searchRegx)
                });

                if (!$scope.copyList.length) {
                    $scope.noresult = true
                }

            } else {
                $scope.copyList = angular.copy(itemList)
            }
        }






        $scope.loginGoogle = function() {
            $http.get('/auth/google').then(function(result) {
                console.log(result, 'logged in')
            }, function(err) {})

        }

        $scope.changeLoginTab = function(param) {
            if (param == 'register')
                $scope.loginTab = false;
            else
                $scope.loginTab = true;
        }
        $scope.loginDialog = function(ev, param) {

            if (param == 'login')
                $scope.loginTab = true;
            else
                $scope.loginTab = false;
            $mdDialog.show({
                contentElement: '#myDialog',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };
        $scope.formuser = {};
        $scope.register = function() {
            var user = angular.copy($scope.formuser);
            user.platform_id = '';
            user.platform = "readninja";
            user.type = "author";
            user.avatar = "img/default--author.png";
            var registerPromise = authService.register(user);
            registerPromise.then(function(result) {
                $scope.loading = false;
                $mdDialog.hide();
                var notify = {
                    type: 'success',
                    title: 'Registration Successfu!',
                    content: 'Welcome to ReadNinja',
                    timeout: 3000 //time in ms
                };
                $scope.$emit('notify', notify);
                $rootScope.logged = true;
                $rootScope.user = result;
                $state.go('home.dashboard');
                //$state.reload();
            }, function(error) {
                console.log('error state of the registration')
                $scope.loading = false;
                $scope.registerError.status = true;
                if (error.status == 400 && error.data.message) {
                    var notify = {
                        type: 'error',
                        title: 'Registration Failed!',
                        content: error.data.message,
                        timeout: 3000 //time in ms
                    };
                    $scope.$emit('notify', notify);
                }
                try {
                    if (error.data.errorname == 'ValidationError')
                        $scope.registerError.message = error.data.message;
                    else if (error.data.errorname == 'MongoError')
                        $scope.registerError.message = user.email + ' ' + ' already exists';
                } catch (e) {
                    $scope.registerError.message = 'something went wrong';
                }

            });
        }
        $scope.login = function() {
            $scope.errorLogin = false;
            var user = angular.copy($scope.formuser);
            user.platform = "readninja";
            var loginPromise = authService.login(user);

            loginPromise.then(function(result) {
                $scope.loading = false;
                var notify = {
                    type: 'success',
                    title: 'Login Success!',
                    content: 'Welcome to ReadNinja',
                    timeout: 2000 //time in ms
                };
                $scope.$emit('notify', notify);
                $mdDialog.hide();
                $rootScope.logged = true;
                $rootScope.user = result;

                $state.go($state.current.name);

            }, function(error) {
                $scope.loading = false;
                var notify = {
                    type: 'error',
                    title: 'Login Failed!',
                    content: error.err,
                    timeout: 3000 //time in ms
                };
                $scope.errorLogin = true;
                $scope.$emit('notify', notify);
            })
        }
        $scope.loginFacebook = function(type) {
            FB.login(function(response) {
                if (response.authResponse) {
                    FB.api('/me', 'GET', { fields: 'email,first_name,last_name,id,photos' }, function(response) {
                        var user = {};
                        if (response.email && response.email != undefined)
                            user.email = response.email;
                        if (response.first_name && response.first_name != undefined) {
                            user.name = response.first_name;
                            user.name += ' ' + response.last_name ? response.last_name : " ";
                        }
                        if (response.id && response.id != undefined)
                            user.platform_id = response.id
                        user.platform = "facebook";
                        user.type = "author";
                        FB.api('/me/picture?width=180&height=180', function(response) {
                            //console.log(response);
                            user.avatar = response.data.url ? response.data.url : "";
                            if (type == 'register') {
                                var registerPromise = authService.register(user);
                                registerPromise.then(function(result) {
                                    var notify = {
                                        type: 'success',
                                        title: 'Login Success!',
                                        content: 'Welcome to ReadNinja',
                                        timeout: 2000 //time in ms
                                    };
                                    $scope.$emit('notify', notify);
                                    $scope.loading = false;
                                    $mdDialog.hide();
                                    $rootScope.logged = true;
                                    $rootScope.user = result;

                                    $state.transitionTo('home.landing');
                                    //$state.reload();
                                }, function(error) {
                                    $scope.loading = false;
                                    $scope.registerError.status = true;
                                    if (error.status == 400 && error.data.message) {
                                        var notify = {
                                            type: 'error',
                                            title: 'Registration Failed!',
                                            content: error.data.message,
                                            timeout: 3000 //time in ms
                                        };
                                        $scope.$emit('notify', notify);
                                    }
                                    try {
                                        if (error.data.errorname == 'ValidationError')
                                            $scope.registerError.message = error.data.message;
                                        else if (error.data.errorname == 'MongoError')
                                            $scope.registerError.message = user.email + ' ' + ' already exists';
                                    } catch (e) {
                                        $scope.registerError.message = 'something went wrong';
                                    }

                                });
                            } else {

                                var loginPromise = authService.login(user);
                                loginPromise.then(function(result) {
                                    var notify = {
                                        type: 'success',
                                        title: 'Login Success!',
                                        content: 'Welcome to ReadNinja',
                                        timeout: 2000 //time in ms
                                    };
                                    $scope.$emit('notify', notify);
                                    $scope.loading = false;
                                    $mdDialog.hide();
                                    $rootScope.logged = true;
                                    $rootScope.user = result;

                                    $state.go($state.current.name);
                                }, function(error) {
                                    $scope.loading = false;
                                    var notify = {
                                        type: 'error',
                                        title: 'Login Failed!',
                                        content: error.err,
                                        timeout: 3000 //time in ms
                                    };
                                    $scope.errorLogin = true;
                                    $scope.$emit('notify', notify);
                                })
                            }
                        });


                        //  console.log(user)

                    });

                } else {
                    console.log('error');
                }
            }, {
                scope: 'email',
                return_scopes: true
            })
        };
        $scope.logout = function() {

                var logoutPromise = authService.logout();
                logoutPromise.then(function(res) {
                    $rootScope.logged = false;
                    var notify = {
                        type: 'warning',
                        title: 'Logout Successfully!',
                        timeout: 3000 //time in ms
                    };
                    //$scope.errorLogin = true;
                    $scope.$emit('notify', notify);
                    $state.go('home.dashboard');
                });

            }
            /* $scope.loginGoogle = function(type) {
                var params = {
                    'clientid': '221548593476-0nlaqr0m19gj5jokujmnflnighjjj44d.apps.googleusercontent.com',
                    'cookiepolicy': 'single_host_origin',
                    'callback': function(result) {
                        if (result['status']['signed_in']) {
                            var request = gapi.client.plus.people.get({
                                'user_id': 'me'
                            });
                            request.execute(function(response) {
                                console.log(response);
                            })
                        }
                    },
                    'approvalprompt': 'force',
                    'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
                };
                gapi.auth.signIn(params);
            } */
    }]).filter('removeSpace', function() {
        return function(x) {
            x = x.split('-').join(' ')
            return x;
        };
    }).filter('readTimeFilter', function() {
        return function(x) {
            if (x === 0) {
                return "3 mins"
            } else if (x === 1)
                return "3- 5 mins"
            else if (x === 2) {
                return "5 - 10 mins"
            } else if (x === 3) {
                return "> 10 mins"
            }
        };
    });

})();

(function() {

    var app = angular.module('hackathon.core.profileController', []);
    app.controller('profileController', ['$scope', 'authorservice', '$state', function($scope, authorservice, $state) {
        console.log('in profile controller');
        $scope.currentNavItem = 'page1';


        var authorservicePromise = authorservice.getAuthorInfo();
        authorservicePromise.then(function(response) {
            console.log(response)
            $scope.authorSide = response;
        }, function(err) {
            console.log(err)
        })


        function changeTabFun(param) {
            if (param === 'home.profile.settings') {
                $scope.profile_tab = true;
                $scope.posts_tab = false;
                $scope.home_tab = false;
            } else if (param === 'home.profile.posts') {
                $scope.posts_tab = true;
                $scope.profile_tab = false;
                $scope.home_tab = false;
            } else {
                $scope.home_tab = true;
                $scope.profile_tab = false;
                $scope.posts_tab = false;
            }
        }

        changeTabFun($state.current.name);
        $scope.changeTab = function(param) {
            changeTabFun(param)
        }
    }])

})();

(function() {

    var app = angular.module('hackathon.core.writerController', []);
    app.controller('writerController', ['$scope', 'authorservice', function($scope, authorservice) {
        console.log('in writer controller');
        $scope.filteredWriters = []
        authorservice.allAuthor().then(function(response) {
            $scope.filteredWriters = response;
        }, function(error) {
            console.log(error);
        })
    }])

})();

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

(function() {
    var app = angular.module('hackthaon.partials.postsController', []);
    app.controller('postsController', ['authorservice', '$scope', '$mdDialog', 'postservice', function(authorservice, $scope, $mdDialog, postservice) {

        $scope.loadTab = false;
        var tempPosts;
        loadingData();

        function loadingData() {


            var authorPostsAllPromise = authorservice.authorPostsAll();
            authorPostsAllPromise.then(function(response) {

                $scope.posts = response[0].posts;
                tempPosts = angular.copy($scope.posts);
                $scope.loadTab = true;
            }, function(error) {

            })
        }
        $scope.goto = function(type) {
            $scope.loadTab = false;
            $scope.posts = [];
            if (type != 'all') {
                $scope.posts = tempPosts.filter(function(post) {

                    return post.status == type
                });
                $scope.loadTab = true;
            } else {
                $scope.posts = angular.copy(tempPosts);
                $scope.loadTab = true;
            }

        }
        $scope.deleteConfirm = function(ev, id) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title('Would you like to delete your post?')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('yes')
                .cancel('oops!');

            $mdDialog.show(confirm).then(function() {

                var deletePostPromise = postservice.deletePost(id);
                deletePostPromise.then(function(response) {
                    loadingData();
                }, function(err) {
                    console.log(err);
                })
            }, function() {

            });
        };
    }])
})();

(function() {

    var app = angular.module('hackathon.directive.prismdirective', []);
    app.directive('prism', [function() {
        return {
            restrict: 'A',
            link: function($scope, element, attrs) {
                element.ready(function() {
                    console.log(typeof element[0])
                    Prism.highlightElement(element[0]);
                });
            }
        }
    }]);
})();

(function() {
    var router = angular.module('hackathon.route.route', []);

    router.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$provide',
        function($stateProvider, $urlRouterProvider, $locationProvider, $provide) {



            $stateProvider
                .state('home', {
                    abstract: true,
                    template: '<ui-view/>'
                })
                .state('home.dashboard', {
                    url: '/',
                    templateUrl: '/templates/dashboard',
                    controller: 'dashboardController'
                })
                .state('home.content', {
                    url: '/posts/:keyword',
                    params: {
                        keyword: null,
                    },
                    templateUrl: '/templates/content',
                    controller: 'contentController'
                })

            .state('home.filter', {
                    url: '/filter/:keyword',
                    params: {
                        keyword: null,
                    },
                    templateUrl: '/templates/filter',
                    controller: 'filterController'
                })
                .state('home.newpost', {
                    url: '/newpost',
                    templateUrl: '/apidata/newpost',
                    controller: 'createPostController as ctrl'
                })
                .state('home.profile', {
                    url: '/author',
                    abstract: true,
                    templateUrl: '/apidata/dashboard-author',
                    controller: 'profileController'
                })
                .state('home.profile.posts', {
                    url: '/posts',
                    templateUrl: '/partials/postsTabs',
                    controller: 'postsController'
                })
                .state('home.profile.settings', {
                    url: '/settings',
                    templateUrl: '/partials/settings',
                    controller: 'basicSettingsController'
                }).state('home.profile.home', {
                    url: '/home',
                    templateUrl: '/partials/home'
                }).state('home.writer', {
                    url: '/writer',
                    templateUrl: '/templates/writer',
                    controller: 'writerController'
                })
                /* 
                                .state('home.filter', {
                                    url: '/filter',
                                    templateUrl: '/templates/filter',
                                    controller: 'filterController'
                                }); */
            $urlRouterProvider
                .otherwise('/');

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: true
            });
            /*$locationProvider.html5Mode(true);*/

        }
    ]);

})();

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
            allPost: function(fparam) {
                var deferred = $q.defer();

                $http.get('/apidata/allpost', { params: { param: fparam } }).then(function(result) {
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
            },
            trendingPost: function() {
                var deferred = $q.defer();
                $http.get('/apidata/trendingPost').then(function(result) {
                    deferred.resolve(result.data);
                }, function(err) {
                    deferred.reject(err.data);
                });
                return deferred.promise;
            },
            allPostName: function() {
                var deferred = $q.defer();
                $http.get('/apidata/allPostName').then(function(result) {
                    deferred.resolve(result.data);
                }, function(err) {
                    deferred.reject(err.data);
                });
                return deferred.promise;
            },
            viewPost: function(param) {
                var deferred = $q.defer();
                $http.post('/apidata/viewPost', { param: param }).then(function(result) {
                    deferred.resolve(result.data);
                }, function(err) {
                    deferred.reject(err.data);
                });
                return deferred.promise;
            },
            clapPost: function(param) {
                var deferred = $q.defer();
                $http.post('/apidata/clapPost', { param: param }).then(function(result) {
                    deferred.resolve(result.data);
                }, function(err) {
                    deferred.reject(err.data);
                });
                return deferred.promise;
            }
        }
    }])

})();
//# sourceMappingURL=hackathon-0.0.0.js.map