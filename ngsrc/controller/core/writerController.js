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