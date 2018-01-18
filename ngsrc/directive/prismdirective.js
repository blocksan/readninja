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