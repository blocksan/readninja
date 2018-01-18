(function() {

    var app = angular.module('hackathon.core.dashboardController', []);
    app.controller('dashboardController', ['$scope', '$state', '$rootScope', function($scope, $state, $rootScope) {
        console.log('in dashboard controller');


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