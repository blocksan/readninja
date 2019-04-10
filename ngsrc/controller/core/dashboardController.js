(function() {

    var app = angular.module('hackathon.core.dashboardController', []);
    app.controller('dashboardController', ['$scope', '$window', '$state', '$rootScope', 'postservice', function($scope, $window, $state, $rootScope, postservice) {
        console.log('in dashboard controller');

        // $scope.showOnceDash = function() {

        //     $window.localStorage.removeItem('portfolioFox');
        //     $window.location.reload();
        // };
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