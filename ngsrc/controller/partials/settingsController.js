(function() {

    var app = angular.module('hackathon.partials.settingsController', []);
    app.controller('settingsController', ['$scope', '$state', '$rootScope', 'authorservice', function($scope, $state, $rootScope, authorservice) {
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
        $scope.saveProfile = function() {
            console.log('clicked')
            $scope.updateLoader = true;
            var updateAuthorPromise = authorservice.updateAuthor($scope.author);
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
                console.log(response);
            })
        }
    }]);

})();