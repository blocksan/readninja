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
    });

})();