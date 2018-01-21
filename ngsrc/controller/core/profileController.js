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