(function() {
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