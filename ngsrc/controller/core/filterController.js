(function() {

    var app = angular.module('hackathon.core.filterController', []);
    app.controller('filterController', ['$scope', '$state', '$rootScope', '$mdSidenav', 'postservice', function($scope, $state, $rootScope, $mdSidenav, postservice) {
        console.log('in filter controller');
        /**
         * Supplies a function that will continue to operate until the
         * time is up.
         */
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

        function buildToggler(navID) {
            return function() {
                // Component lookup should always be available since we are not using `ng-if`
                $mdSidenav(navID)
                    .toggle()
                    .then(function() {
                        $log.debug("toggle " + navID + " is done");
                    });
            };
        }

        $scope.users = [];
        var allPostPromise = postservice.allPost();
        allPostPromise.then(function(response) {
            $scope.posts = response;
            console.log($scope.posts)
                /* response.forEach((obj, i) => {
                    console.log(obj, i)
                    $scope.users[i] = obj.heading

                }); */
            $scope.users = response;
            //console.log(response, 'all post');
            $scope.filteredUsers = $scope.users;
            $scope.searchString = '';

            $scope.search = function() {
                let nameRegexp = new RegExp($scope.searchString, 'i');
                console.log($scope.users, '---', nameRegexp)
                $scope.filteredUsers = $scope.users.filter(user => user.heading.match(nameRegexp));
            }

        }, function(error) {
            console.log(error)
        });
        console.log($scope.users);
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