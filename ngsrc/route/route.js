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
                    url: '/filter',
                    templateUrl: '/templates/filter',
                    controller: 'filterController'
                })
                .state('home.newpost', {
                    url: '/newpost',
                    templateUrl: '/apidata/newpost',
                    controller: 'createPostController'
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
                    controller: 'settingsController'
                }).state('home.profile.home', {
                    url: '/home',
                    templateUrl: '/partials/home'
                });
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